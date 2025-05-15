package src

import (
	"main/src/users"
)

type Services struct {
	users users.Services
}

func NewServices(users users.Services) *Services {
	return &Services{users: users}
}
