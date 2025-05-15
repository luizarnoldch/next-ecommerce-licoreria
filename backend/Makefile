# Variables
TEMPLATE_FILE := infrastructure/aws/template.yml  # Path to the CloudFormation template
STACK_NAME := CognitoIntegrationTest  # Name of the CloudFormation stack
PROJECT_NAME := authtest  # Name of the CloudFormation project
BUCKET_NAME := cognito-s3-bucket-test  # Replace with your S3 bucket name
AWS_REGION := us-east-1  # AWS region for the S3 bucket (change if necessary)

# Ensure no extra spaces in variable definitions
strip = $(shell echo $(1) | xargs)  # Function to trim whitespace
BUCKET_NAME := $(call strip,$(BUCKET_NAME))
AWS_REGION := $(call strip,$(AWS_REGION))


.PHONY: ng sql-up sql-down test db

%:
	@:

CMD := $(word 2,$(MAKECMDGOALS))

db:
	@# Validar parámetros
	@if [ [ -z "$(CMD)" ]; then \
		echo "Usage: make db <reset|up|down|seed>"; \
		exit 1; \
	fi
	@echo "Running database command: $(CMD)"
	go run ./infrastructure/db_tool/main.go $(CMD)

# Build the project
build:
	@echo "Building the project..."  # Log message indicating project build
	chmod +x -R ./scripts/  # Makes the scripts executable
	./scripts/build.sh  # Runs the custom build script
	@echo "Project built."  # Log message after the build process

# Create an S3 bucket with a policy for CloudFormation
create-s3:
	@echo "Creating S3 bucket ${BUCKET_NAME} in region ${AWS_REGION}..."  # Log message indicating the creation of the S3 bucket
	@if [ "${AWS_REGION}" = "us-east-1" ]; then \
		aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${AWS_REGION}"; \
	else \
		aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${AWS_REGION}" --create-bucket-configuration LocationConstraint="${AWS_REGION}"; \
	fi; \
	# Create the bucket policy
	POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"cloudformation.amazonaws.com"},"Action":"s3:*","Resource":"arn:aws:s3:::${BUCKET_NAME}/*"}]}'; \
	aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy "$$POLICY"; \
	echo "S3 bucket ${BUCKET_NAME} created with policy for CloudFormation."  # Log message after the bucket is created

# Check if the S3 bucket exists
check-s3:
	@echo "Checking if S3 bucket ${BUCKET_NAME} exists..."  # Log message indicating that the bucket check is starting
	@if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then \
		echo "Bucket ${BUCKET_NAME} already exists."; \
	else \
		echo "Bucket ${BUCKET_NAME} does not exist. Creating it..."; \
		$(MAKE) create-s3; \
	fi  # Ensure 'fi' is properly placed in the shell command

# Upload CloudFormation templates and the /bin/cognito directory to S3
upload-s3:
	@echo "Uploading templates to S3..."  # Log message indicating the templates are being uploaded
	aws s3 cp templates/cloudformation/cognito.yml s3://${BUCKET_NAME}/cognito.yml  # Uploads the Cognito CloudFormation template to S3
	aws s3 cp templates/cloudformation/main.yml s3://${BUCKET_NAME}/main.yml  # Uploads the main CloudFormation template to S3
	@echo "Uploading /bin/cognito directory to S3..."  # Log message for the /bin/cognito directory upload
	aws s3 cp bin/cognito s3://${BUCKET_NAME}/cognito --recursive  # Uploads all contents of the /bin/cognito directory to the cognito directory in S3
	@echo "Templates and /bin/cognito directory uploaded to S3."  # Log message after all uploads


# Deploy the CloudFormation stack using SAM
deploy:
	@echo "Deploying the infrastructure..."  # Log message indicating that the deployment is starting
	sam deploy --template-file $(TEMPLATE_FILE) \
		--stack-name $(STACK_NAME) \
		--s3-bucket $(BUCKET_NAME) \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides "ProjectName=$(PROJECT_NAME) Stage=Prod S3BucketStackName=$(BUCKET_NAME)"  # Added S3BucketStackName parameter
	@echo "Infrastructure deployed."  # Log message after deployment

# Delete the CloudFormation stack
destroy:
	@echo "Destroying the infrastructure..."  # Log message indicating that the stack is being destroyed
	aws cloudformation delete-stack --stack-name ${STACK_NAME}  # Deletes the CloudFormation stack using the AWS CLI
	@echo "Infrastructure destroyed."  # Log message after destruction

# Full process: Check if the S3 bucket exists, upload templates, and deploy the stack
cd: build check-s3 upload-s3 deploy  # Executes the 'check-s3', 'upload-s3', and 'deploy' targets in sequence
	@echo "Deployment process completed."  # Log message after the full deployment process