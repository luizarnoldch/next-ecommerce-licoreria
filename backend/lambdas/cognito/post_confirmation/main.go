package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(
	ctx context.Context,
	event events.CognitoEventUserPoolsPostConfirmation) (events.CognitoEventUserPoolsPostConfirmation, error) {
	log.Printf("PostConfirmation trigger invoked for user %s", event.UserName)

	// eventJSON, err := json.Marshal(event)
	// if err != nil {
	// 	log.Printf("Error marshalling event to JSON: %v", err)
	// 	return event, err
	// }

	// log.Printf("Event: %s\n", string(eventJSON))

	/**
	* TODO: Override Claims
	* TODO: Add to cognito group
	 */

	return event, nil
}

func main() {
	lambda.Start(handler)
}
