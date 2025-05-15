-- Assign Role to User
-- name: AssignUserRole :exec
INSERT    INTO user_role_assignments (user_id, role_id)
VALUES    (?, ?);

-- Get User Roles
-- name: GetUserRoles :many
SELECT    r.*
FROM      user_roles r
JOIN      user_role_assignments a ON r.role_id = a.role_id
WHERE     a.user_id = ?;

-- Remove Role from User
-- name: RemoveUserRole :exec
DELETE    FROM user_role_assignments
WHERE     user_id = ? AND      
          role_id = ?;

-- Check Role Assignment
-- name: HasUserRole :one
SELECT    EXISTS (
          SELECT    1
          FROM      user_role_assignments
          WHERE     user_id = ? AND      
                    role_id = ?
          );