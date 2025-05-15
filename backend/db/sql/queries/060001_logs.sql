-- Log system event
-- name: CreateLog :one
INSERT    INTO logs (user_id, action_type, details, ip_address)
VALUES    (?, ?, ?, ?)
RETURNING *;

-- Get recent logs
-- name: GetLogs :many
SELECT    l.*,
          u.email AS user_email
FROM      logs l
LEFT JOIN users u ON l.user_id = u.user_id
ORDER BY  l.created_at DESC
LIMIT     ?;

-- Filter logs by action type
-- name: GetLogsByAction :many
SELECT    *
FROM      logs
WHERE     action_type = ?
ORDER BY  created_at DESC;

-- Get user activity log
-- name: GetUserActivity :many
SELECT    *
FROM      logs
WHERE     user_id = ?
ORDER BY  created_at DESC;

-- Prune old logs
-- name: DeleteOldLogs :exec
DELETE    FROM logs
WHERE     created_at < ?;