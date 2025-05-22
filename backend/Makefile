# Variables
TEMPLATE_FILE := infrastructure/aws/template.yml  # Path to the CloudFormation template
STACK_NAME := EcommerceTemplate  # Name of the CloudFormation stack
PROJECT_NAME := ecommerce  # Name of the CloudFormation project
BUCKET_NAME := ecommerce-arnold-s3-bucket  # Replace with your S3 bucket name

# Ensure no extra spaces in variable definitions
strip = $(shell echo $(1) | xargs)  # Function to trim whitespace
BUCKET_NAME := $(call strip,$(BUCKET_NAME))

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
	go run ./infrastructure/scripts/build/main.go
	@echo "Project built."

# Create an S3 bucket with a policy for CloudFormation
create-s3:
	@echo "Creating the S3 Bucket..."
	go run ./infrastructure/scripts/create-s3/main.go
	@echo "S3 Bucket Created."

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
	aws s3 cp infrastructure/aws/ s3://${BUCKET_NAME}/infrastructure/ --recursive --exclude "*.swp"
	@echo "Uploading /bin/cognito directory to S3..."
	aws s3 cp bin/ s3://${BUCKET_NAME}/infrastructure/lambdas --recursive
	@echo "Templates and /bin directory uploaded to S3."
	
# aws s3api head-object --bucket ${BUCKET_NAME} --key infrastructure/lambdas/post_confirmation.zip --query VersionId --output text


# Deploy the CloudFormation stack using SAM
deploy:
	@echo "Deploying the infrastructure..."
	go run ./infrastructure/scripts/deploy-template/main.go
	@echo "Infrastructure deployed."

# Delete the CloudFormation stack
destroy:
	@echo "Destroying the infrastructure..."
	aws cloudformation delete-stack --stack-name ${STACK_NAME}
	@echo "Infrastructure destroyed."

# Full process: Check if the S3 bucket exists, upload templates, and deploy the stack
cd: build check-s3 upload-s3 deploy  # Executes the 'check-s3', 'upload-s3', and 'deploy' targets in sequence
	@echo "Deployment process completed."