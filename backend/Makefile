# Variables
TEMPLATE_FILE := infrastructure/aws/template.yml  # Path to the CloudFormation template
STACK_NAME := EcommerceTemplate  # Name of the CloudFormation stack
PROJECT_NAME := ecommerce  # Name of the CloudFormation project
BUCKET_NAME := ecommerce-arnold-s3-bucket  # Replace with your S3 bucket name
AWS_REGION := us-east-1  # AWS region for the S3 bucket (change if necessary)

# Ensure no extra spaces in variable definitions
strip = $(shell echo $(1) | xargs)  # Function to trim whitespace
BUCKET_NAME := $(call strip,$(BUCKET_NAME))
AWS_REGION := $(call strip,$(AWS_REGION))


.PHONY: db build create-s3 check-s3 upload-s3 deploy destroy cd

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
	@echo "Building the project..."
	go run ./infrastructure/build.go
	@echo "Project built."

# Create an S3 bucket with a policy for CloudFormation
create-s3:
	@echo "Creating S3 bucket ${BUCKET_NAME} in region ${AWS_REGION}..."
	@if [ "${AWS_REGION}" = "us-east-1" ]; then \
		aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${AWS_REGION}"; \
	else \
		aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${AWS_REGION}" --create-bucket-configuration LocationConstraint="${AWS_REGION}"; \
	fi; \
	# Create the bucket policy
	POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"cloudformation.amazonaws.com"},"Action":"s3:*","Resource":"arn:aws:s3:::${BUCKET_NAME}/*"}]}'; \
	aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy "$$POLICY"; \
	echo "S3 bucket ${BUCKET_NAME} created with policy for CloudFormation."

# Check if the S3 bucket exists
check-s3:
	@echo "Checking if S3 bucket ${BUCKET_NAME} exists..."
	@if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then \
		echo "Bucket ${BUCKET_NAME} already exists."; \
	else \
		echo "Bucket ${BUCKET_NAME} does not exist. Creating it..."; \
		$(MAKE) create-s3; \
	fi

# Upload CloudFormation templates and the /bin/cognito directory to S3
upload-s3:
	@echo "Uploading templates to S3..."
	aws s3 cp infrastructure/aws/cognito.yml s3://${BUCKET_NAME}/infrastructure/cognito.yml
	aws s3 cp infrastructure/aws/apigateway.yml s3://${BUCKET_NAME}/infrastructure/apigateway.yml
	aws s3 cp infrastructure/aws/template.yml s3://${BUCKET_NAME}/infrastructure/template.yml
	@echo "Uploading /bin/cognito directory to S3..."
	aws s3 cp bin/ s3://${BUCKET_NAME}/infrastructure/lambdas --recursive
	@echo "Templates and /bin directory uploaded to S3."

# Deploy the CloudFormation stack using SAM
deploy:
	@echo "Deploying the infrastructure..."
	sam deploy --template-file $(TEMPLATE_FILE) \
		--stack-name $(STACK_NAME) \
		--s3-bucket $(BUCKET_NAME) \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides "ProjectName=$(PROJECT_NAME) Stage=Prod S3BucketStackName=$(BUCKET_NAME)"
	@echo "Infrastructure deployed."

# Delete the CloudFormation stack
destroy:
	@echo "Destroying the infrastructure..."
	aws cloudformation delete-stack --stack-name ${STACK_NAME}
	@echo "Infrastructure destroyed."

# Full process: Check if the S3 bucket exists, upload templates, and deploy the stack
cd: build check-s3 upload-s3 deploy  # Executes the 'check-s3', 'upload-s3', and 'deploy' targets in sequence
	@echo "Deployment process completed."