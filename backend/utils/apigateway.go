package utils

import (
	"encoding/base64"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

// defaultHeaders defines the default JSON headers.
var defaultHeaders = map[string]string{
	// "Access-Control-Allow-Origin":  "*",
	// "Access-Control-Allow-Methods": "DELETE,GET,HEAD,POST,PUT",
	// "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
	"Content-Type": "application/json",
}

// buildResponse constructs the APIGatewayProxyResponse with given options.
func buildResponse(
	statusCode int,
	body any,
	headers map[string]string,
	multiValueHeaders map[string][]string,
	isBase64 bool,
) (*events.APIGatewayProxyResponse, error) {
	// Serialize body if not a string
	var bodyStr string
	switch v := body.(type) {
	case string:
		bodyStr = v
	default:
		b, err := json.Marshal(v)
		if err != nil {
			log.Printf("Error marshaling response: %v", err)
			// Return generic error response
			return &events.APIGatewayProxyResponse{
				StatusCode:        500,
				Body:              `{"error":"Error marshaling response"}`,
				Headers:           headers,
				MultiValueHeaders: multiValueHeaders,
				IsBase64Encoded:   isBase64,
			}, nil
		}
		bodyStr = string(b)
	}

	// Encode in Base64 if required
	if isBase64 {
		bodyStr = base64.StdEncoding.EncodeToString([]byte(bodyStr))
	}

	return &events.APIGatewayProxyResponse{
		StatusCode:        statusCode,
		Headers:           headers,
		MultiValueHeaders: multiValueHeaders,
		Body:              bodyStr,
		IsBase64Encoded:   isBase64,
	}, nil
}

// JSON returns a standard JSON response with default headers.
func ApiResponseToJSON(statusCode int, body any) (*events.APIGatewayProxyResponse, error) {
	return buildResponse(statusCode, body, defaultHeaders, nil, false)
}

// JSONBase64 returns a JSON response encoded in Base64 with default headers.
func ApiResponseToJSONBase64(statusCode int, body any) (*events.APIGatewayProxyResponse, error) {
	return buildResponse(statusCode, body, defaultHeaders, nil, true)
}

// WithHeaders returns a JSON response with custom headers.
func ApiResponseWithHeaders(statusCode int, body any, headers map[string]string) (*events.APIGatewayProxyResponse, error) {
	return buildResponse(statusCode, body, headers, nil, false)
}

// WithMultiValueHeaders returns a JSON response with multi-value headers.
func ApiResponseWithMultiValueHeaders(statusCode int, body any, mvHeaders map[string][]string) (*events.APIGatewayProxyResponse, error) {
	return buildResponse(statusCode, body, defaultHeaders, mvHeaders, false)
}

// WithAllOptions returns a response with custom headers, multi-value headers, and optional Base64 encoding.
func ApiResponseWithAllOptions(
	statusCode int,
	body interface{},
	headers map[string]string,
	mvHeaders map[string][]string,
	isBase64 bool,
) (*events.APIGatewayProxyResponse, error) {
	return buildResponse(statusCode, body, headers, mvHeaders, isBase64)
}

// ErrorResponse returns an error response with a given status code and error message.
func ApiResponseWithError(statusCode int, errMessage string) (*events.APIGatewayProxyResponse, error) {
	// Prepare error payload
	errPayload := struct {
		Error string `json:"error"`
	}{Error: errMessage}

	return buildResponse(statusCode, errPayload, defaultHeaders, nil, false)
}
