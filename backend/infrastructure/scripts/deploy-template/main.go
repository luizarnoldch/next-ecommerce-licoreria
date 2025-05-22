package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"

	"path/filepath"
	"strings"

	"main/config"
	"main/utils"

	"github.com/aws/aws-sdk-go-v2/service/s3"

)

const (
	bucketLambdaKey  = "infrastructure/lambdas"
	templateFilePath = "infrastructure/aws/template.yml" // change as needed or load from config
	stackName        = "EcommerceTemplate"               // change as needed or load from config
	projectName      = "ecommerce"                       // change as needed or load from config
	stage            = "Prod"
)

func FindProjectRoot(start string) (string, error) {
	current := start
	for {
		goModPath := filepath.Join(current, "go.mod")
		if info, err := os.Stat(goModPath); err == nil && !info.IsDir() {
			return current, nil
		}

		parent := filepath.Dir(current)
		if parent == current {
			return "", errors.New("no se encontró go.mod en ningún directorio padre de " + start)
		}
		current = parent
	}
}

func ListFilesInDir(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	var files []string
	for _, e := range entries {
		if !e.IsDir() {
			files = append(files, e.Name())
		}
	}
	return files, nil
}

func ListFiles() ([]string, error) {
	start, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	root, err := FindProjectRoot(start)
	if err != nil {
		return nil, err
	}
	binDir := filepath.Join(root, "bin")
	return ListFilesInDir(binDir)
}

// ConvertZipNameToTemplateName converts a list of zip file names to a slice of LambdaNames with TemplateName camel-cased.
func ConvertZipNameToTemplateName(zipNames []string) []LambdaNames {
	lambdas := make([]LambdaNames, 0, len(zipNames))

	for _, zip := range zipNames {
		// Remove extension, e.g. "post_confirmation.zip" -> "post_confirmation"
		baseName := strings.TrimSuffix(zip, filepath.Ext(zip))

		// Convert 'post_confirmation' -> 'PostConfirmation'
		templateName := toPascalCase(baseName)

		lambdas = append(lambdas, LambdaNames{
			ZipName:      zip,
			TemplateName: templateName,
			VersionCode:  "",
		})
	}

	return lambdas
}

// toPascalCase converts a snake_case string to PascalCase
func toPascalCase(input string) string {
	// Split string by underscore
	parts := strings.Split(input, "_")

	for i, part := range parts {
		if len(part) == 0 {
			continue
		}
		// Uppercase first letter + lowercase rest (in case)
		parts[i] = strings.ToUpper(part[:1]) + strings.ToLower(part[1:])
	}

	return strings.Join(parts, "")
}

// LambdaNames represents the zip, template name, and version code
type LambdaNames struct {
	ZipName      string // e.g. post_confirmation.zip
	TemplateName string // e.g. PostConfirmation
	VersionCode  string // will be filled with S3 VersionID for that zip
}

func GetLatestVersionID(ctx context.Context, s3Client *s3.Client, bucket, key string) (string, error) {
	headInput := &s3.HeadObjectInput{
		Bucket: &bucket,
		Key:    &key,
	}
	headOutput, err := s3Client.HeadObject(ctx, headInput)
	if err != nil {
		return "", err
	}

	// VersionId can be nil if versioning disabled, handle that case
	if headOutput.VersionId == nil || *headOutput.VersionId == "" {
		// If versioning not enabled, you may decide what to do — here returning empty string or error
		return "", fmt.Errorf("versioning is not enabled or VersionId is missing for key: %s", key)
	}

	return *headOutput.VersionId, nil
}

func main() {
	ctx := context.Background()

	// 1. Load configuration, AWS config and create S3 client
	env, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	awsCfg, err := utils.LoadAWSConfig(ctx,
		env.MICRO.AWS.AWS_REGION,
		env.MICRO.AWS.AWS_ACCESS_KEY_ID,
		env.MICRO.AWS.AWS_SECRET_ACCESS_KEY)
	if err != nil {
		log.Fatalf("aws config error: %v", err)
	}
	s3Client := s3.NewFromConfig(*awsCfg)

	// 2. List local zip files (already implemented in dt_utils)
	lambdaNames, err := ListFiles()
	if err != nil {
		log.Fatalf("Error listing lambda zip files: %v", err)
	}
	// fmt.Printf("Local zip files: %+v\n", lambdaNames)

	// 3. Convert zip names to TemplateNames struct slice
	lambdaStructs := ConvertZipNameToTemplateName(lambdaNames)
	// fmt.Printf("Lambda structs: %+v\n", lambdaStructs)

	// 4. For each zip file retrieve S3 version ID from s3://bucket/infrastructure/lambdas/zipName
	for i, lambda := range lambdaStructs {
		key := fmt.Sprintf("%s/%s", bucketLambdaKey, lambda.ZipName)
		verID, err := GetLatestVersionID(ctx, s3Client, env.MICRO.AWS.BUCKET_NAME, key)
		if err != nil {
			log.Fatalf("Failed to get version ID for key %s: %v", key, err)
		}
		lambdaStructs[i].VersionCode = verID
	}

	// 5. Build SAM CLI parameter overrides string:
	//
	// It's usually space-separated key=value pairs e.g.,
	// "ProjectName=MyProject Stage=Prod S3BucketStackName=my-bucket-name LambdaA=version1 LambdaB=version2"
	//
	// Start with common parameters:
	paramOverrides := []string{
		fmt.Sprintf("ProjectName=%s", projectName),
		fmt.Sprintf("Stage=%s", stage),
		fmt.Sprintf("S3BucketStackName=%s", env.MICRO.AWS.BUCKET_NAME),
	}

	// Add Lambda version parameters: TemplateName=VersionCode
	for _, lambda := range lambdaStructs {
		// e.g. "PostConfirmation=versionid"
		paramOverrides = append(paramOverrides, fmt.Sprintf("%sLambdaVersion=%s", lambda.TemplateName, lambda.VersionCode))
	}

	parameterOverridesStr := strings.Join(paramOverrides, " ")

	fmt.Println("Parameter overrides to pass:", parameterOverridesStr)

	// 6. Run sam deploy command as:
	// sam deploy --template-file infrastructure/aws/template.yml \
	//           --stack-name EcommerceTemplate \
	//           --s3-bucket my-bucket-name \
	//           --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
	//           --parameter-overrides "..."

	cmdArgs := []string{
		"deploy",
		"--template-file", templateFilePath,
		"--stack-name", stackName,
		"--s3-bucket", env.MICRO.AWS.BUCKET_NAME,
		"--capabilities", "CAPABILITY_IAM", "CAPABILITY_AUTO_EXPAND",
		"--parameter-overrides", parameterOverridesStr,
	}

	fmt.Printf("Running command: sam %s\n", strings.Join(cmdArgs, " "))

	cmd := exec.Command("sam", cmdArgs...)
	cmd.Stdout = os.Stdout // or os.Stdout to see output
	cmd.Stderr = os.Stderr // or os.Stderr to see errors

	if err := cmd.Run(); err != nil {
		log.Fatalf("sam deploy failed: %v", err)
	}

	fmt.Println("Deployment complete.")
}
