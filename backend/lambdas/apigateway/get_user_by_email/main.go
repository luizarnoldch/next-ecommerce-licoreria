package main

import (
	"context"
	"encoding/json"
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
	respBody := HelloResponse{Message: "Hello, World!"}
	body, _ := json.Marshal(respBody)
	return utils.ApiResponseToJSON(200, body)
}

func main() {
	lambda.Start(handler)
}
