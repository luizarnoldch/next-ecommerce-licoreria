-- Create User
-- name: CreateUser :one
INSERT    INTO users (email, password_hash, NAME)
VALUES    (?, ?, ?)
RETURNING *;

-- Get User by ID
-- name: GetUserByID :one
SELECT    *
FROM      users
WHERE     user_id = ?;

-- Get User by Email
-- name: GetUserByEmail :one
SELECT    *
FROM      users
WHERE     email = ?;

-- Update User Details
-- name: UpdateUser :one
UPDATE    users
SET       email = COALESCE(?, email),
          password_hash = COALESCE(?, password_hash),
          NAME = COALESCE(?, NAME),
          last_login = COALESCE(?, last_login),
          is_active = COALESCE(?, is_active)
WHERE     user_id = ?
RETURNING *;

-- Deactivate User
-- name: DeactivateUser :exec
UPDATE    users
SET       is_active = 0
WHERE     user_id = ?;

-- Delete User
-- name: DeleteUser :exec
DELETE    FROM users
WHERE     user_id = ?;