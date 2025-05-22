package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"main/config"
	"main/utils"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func main() {
	env, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	ctx := context.Background()
	cfg, err := utils.LoadAWSConfig(ctx, env.MICRO.AWS.AWS_REGION, env.MICRO.AWS.AWS_ACCESS_KEY_ID, env.MICRO.AWS.AWS_SECRET_ACCESS_KEY)
	if err != nil {
		log.Fatalf("Error loading aws: %v", err)
	}
	s3Client := s3.NewFromConfig(*cfg)

	// 1. Create bucket
	createParams := &s3.CreateBucketInput{
		Bucket: aws.String(env.MICRO.AWS.BUCKET_NAME),
	}

	// Special case for non‑us-east-1
	if env.MICRO.AWS.AWS_REGION != "us-east-1" {
		createParams.CreateBucketConfiguration = &types.CreateBucketConfiguration{
			LocationConstraint: types.BucketLocationConstraint(env.MICRO.AWS.AWS_REGION),
		}
	}

	if _, err := s3Client.CreateBucket(ctx, createParams); err != nil {
		log.Fatalf("failed to create bucket: %v", err)
	}
	fmt.Printf("Bucket %s created in %s\n", env.MICRO.AWS.BUCKET_NAME, env.MICRO.AWS.AWS_REGION)

	// 2. Put bucket policy
	policy := map[string]any{
		"Version": "2012-10-17",
		"Statement": []map[string]any{{
			"Effect": "Allow",
			"Principal": map[string]any{
				"Service": "cloudformation.amazonaws.com",
			},
			"Action": []string{
				"s3:*",
			},
			"Resource": []string{
				fmt.Sprintf("arn:aws:s3:::%s", env.MICRO.AWS.BUCKET_NAME),
				fmt.Sprintf("arn:aws:s3:::%s/*", env.MICRO.AWS.BUCKET_NAME),
			},
		}},
	}
	policyJSON, err := json.Marshal(policy)
	if err != nil {
		log.Fatalf("Error marshaling json to policy bucket on s3: %v", err)
	}
	if _, err := s3Client.PutBucketPolicy(ctx, &s3.PutBucketPolicyInput{
		Bucket: aws.String(env.MICRO.AWS.BUCKET_NAME),
		Policy: aws.String(string(policyJSON)),
	}); err != nil {
		log.Fatalf("failed to put bucket policy: %v", err)
	}
	fmt.Printf("Policy applied to bucket %s\n", env.MICRO.AWS.BUCKET_NAME)

	// 3. Enable versioning
	if _, err := s3Client.PutBucketVersioning(ctx, &s3.PutBucketVersioningInput{
		Bucket: aws.String(env.MICRO.AWS.BUCKET_NAME),
		VersioningConfiguration: &types.VersioningConfiguration{
			Status: types.BucketVersioningStatusEnabled,
		},
	}); err != nil {
		log.Fatalf("failed to enable versioning: %v", err)
	}
	fmt.Printf("Versioning enabled on bucket %s\n", env.MICRO.AWS.BUCKET_NAME)
}
