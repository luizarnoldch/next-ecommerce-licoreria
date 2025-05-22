package main

import (
	"context"
	"log"
	"main/utils"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// HelloResponse es el modelo de respuesta para /hello
// swagger:model HelloResponse
type HelloResponse struct {
	Message string `json:"message"`
}

// handler es el entry point de la Lambda
// @Summary     Hello endpoint
// @Description Returns a Hello World message
// @Tags        example
// @Produce     json
// @Success     200 {object} HelloResponse
// @Router      /hello [get]
func handler(ctx context.Context, req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	// Log the incoming event for debugging
	log.Printf("Received event: %+v", req)

	// Build the response payload
	respBody := HelloResponse{Message: "Hello, World! Updated!"}

	return utils.ApiResponseToJSON(200, respBody)
}

func main() {
	lambda.Start(handler)
}
