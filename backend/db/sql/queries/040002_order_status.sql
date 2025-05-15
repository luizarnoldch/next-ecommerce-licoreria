-- Predefined statuses (initial data migration)
-- name: SeedOrderStatuses :exec


-- List all statuses
-- name: ListOrderStatuses :many
SELECT    *
FROM      order_status
ORDER BY  status_id;