package seed

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"main/db"
)

func UserInyection(ctx context.Context, dbClient *db.Queries) {
	// 1. Create a new user
	user, err := dbClient.CreateUser(ctx,
		"example@example.com",
		sql.NullString{String: "example", Valid: true},
		sql.NullString{String: "Luis Chavez", Valid: true},
	)
	if err != nil {
		log.Fatal("CreateUser:", err)
	}
	fmt.Printf("New user: %+v\n", user)

	// 2. Create a new role
	role, err := dbClient.CreateUserRole(ctx, "customer")
	if err != nil {
		log.Fatal("CreateUserRole:", err)
	}
	fmt.Printf("New role: %+v\n", role)

	// 3. Assign the role to the user
	if err := dbClient.AssignUserRole(ctx, user.UserID, role.RoleID); err != nil {
		log.Fatal("AssignUserRole:", err)
	}
	fmt.Println("Role assigned to user.")

	// 4. Prepare address parameters
	addressParams := db.CreateUserAddressParams{
		UserID:           user.UserID,
		EncryptedAddress: "AES256_ENCRYPTED_ADDRESS",
		City:             "Lima",
		Region:           "Lima",
		Phone:            []byte("ENCRYPTED_PHONE_BYTES"),
		IsDefault:        sql.NullInt64{Int64: 1, Valid: true},
	}

	// 5. Create a new address for the user
	address, err := dbClient.CreateUserAddress(ctx, addressParams)
	if err != nil {
		log.Fatal("CreateUserAddress:", err)
	}
	fmt.Printf("New address: %+v\n", address)

	// 6. Add a social login entry
	socialLoginErr := dbClient.AddUserSocialLogin(ctx, user.UserID, "google", "google-unique-id-123")
	if socialLoginErr != nil {
		log.Fatal("AddUserSocialLogin:", socialLoginErr)
	}
	fmt.Println("New social login added.")

	log.Println("All SQL seed data injected successfully.")
}
