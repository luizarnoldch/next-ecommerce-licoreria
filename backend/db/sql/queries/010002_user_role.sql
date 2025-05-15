-- Create Role
-- name: CreateUserRole :one
INSERT    INTO user_roles (role_name)
VALUES    (?)
RETURNING *;

-- Get All Roles
-- name: ListUserRoles :many
SELECT    *
FROM      user_roles
ORDER BY  role_name;

-- Get Role by ID
-- name: GetUserRoleByID :one
SELECT    *
FROM      user_roles
WHERE     role_id = ?;

-- Update Role Name
-- name: UpdateUserRoleName :exec
UPDATE    user_roles
SET       role_name = ?
WHERE     role_id = ?;

-- Delete Role
-- name: DeleteUserRole :exec
DELETE    FROM user_roles
WHERE     role_id = ?;