package config

import (
	"fmt"
	"os"

	"log"

	"github.com/joho/godotenv"
)

func sanityCheck() {
	requiredEnvVars := []string{
		"ENV",

		"DATABASE_URL",

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
		},
		ENV: os.Getenv("ENV"),
	}, nil
}
