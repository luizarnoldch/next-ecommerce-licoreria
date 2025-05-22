package config

import (
	"fmt"
	"os"

	"log"

	"github.com/joho/godotenv"
)

func sanityCheck() {
	requiredEnvVars := []string{
		// IAC CONFIGURATION
		"BUCKET_NAME",
		"STACK_NAME",
		"AWS_REGION",
		"AWS_ACCESS_KEY_ID",
		"AWS_SECRET_ACCESS_KEY",

		// SERVER CONFIGURATION
		"ENV",
		"DATABASE_URL",

		// AI CONFIGURATION
		"DEEPSEEK_API_KEY",
		"OPENAI_API_KEY",
	}

	for _, envVar := range requiredEnvVars {
		if value := os.Getenv(envVar); value == "" {
			log.Fatalf("Environment variable %s not defined. Terminating application...", envVar)
		}
	}
}

func LoadConfig() (*CONFIG, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env: %v", err)
		return nil, fmt.Errorf("error loading .env: %v", err)
	}

	sanityCheck()

	return &CONFIG{
		MICRO: MICRO{
			DB: DB{
				SQLITE: SQLITE{
					URI: os.Getenv("DATABASE_URL"),
				},
			},
			AWS: AWS{
				STACK_NAME:            os.Getenv("STACK_NAME"),
				BUCKET_NAME:           os.Getenv("BUCKET_NAME"),
				AWS_REGION:            os.Getenv("AWS_REGION"),
				AWS_ACCESS_KEY_ID:     os.Getenv("AWS_ACCESS_KEY_ID"),
				AWS_SECRET_ACCESS_KEY: os.Getenv("AWS_SECRET_ACCESS_KEY"),
			},
		},
		ENV: os.Getenv("ENV"),
	}, nil
}
