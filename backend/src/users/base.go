package users

import (
	"context"
	"database/sql"
	"log"
	"main/db"
)

type UserServices interface {
	CreateUser(ctx context.Context, email string, passwordHash sql.NullString, name sql.NullString) (db.User, error)
	GetUserByID(ctx context.Context, id int64) (db.User, error)
	GetUserByEmail(ctx context.Context, email string) (db.User, error)
	UpdateUser(ctx context.Context, params db.UpdateUserParams) (db.User, error)
	DeleteUser(ctx context.Context, id int64) error
	DeactivateUser(ctx context.Context, id int64) error
}

type Services struct {
	db *db.Queries
}

func NewServices(db *db.Queries) *Services {
	return &Services{db: db}
}

func (s *Services) CreateUser(ctx context.Context, email string, passwordHash sql.NullString, name sql.NullString) (db.User, error) {
	user, err := s.db.CreateUser(ctx, email, passwordHash, name)
	if err != nil {
		log.Printf("Error creating user: %s", err)
		return db.User{}, err
	}
	return user, nil
}

func (s *Services) GetUserByID(ctx context.Context, id int64) (db.User, error) {
	user, err := s.db.GetUserByID(ctx, id)
	if err != nil {
		log.Printf("Error fetching user by ID %d: %s", id, err)
		return db.User{}, err
	}
	return user, nil
}

func (s *Services) GetUserByEmail(ctx context.Context, email string) (db.User, error) {
	user, err := s.db.GetUserByEmail(ctx, email)
	if err != nil {
		log.Printf("Error fetching user by email %s: %s", email, err)
		return db.User{}, err
	}
	return user, nil
}

func (s *Services) UpdateUser(ctx context.Context, params db.UpdateUserParams) (db.User, error) {
	user, err := s.db.UpdateUser(ctx, params)
	if err != nil {
		log.Printf("Error updating user ID %d: %s", params.UserID, err)
		return db.User{}, err
	}
	return user, nil
}

func (s *Services) DeleteUser(ctx context.Context, id int64) error {
	err := s.db.DeleteUser(ctx, id)
	if err != nil {
		log.Printf("Error deleting user ID %d: %s", id, err)
		return err
	}
	return nil
}

func (s *Services) DeactivateUser(ctx context.Context, id int64) error {
	err := s.db.DeactivateUser(ctx, id)
	if err != nil {
		log.Printf("Error deactivating user ID %d: %s", id, err)
		return err
	}
	return nil
}
