-- Get order history
-- name: GetOrderHistory :many
SELECT    h.*,
          s.status_name
FROM      order_status_history h
JOIN      order_status s ON h.status_id = s.status_id
WHERE     order_id = ?
ORDER BY  created_at DESC;

-- name: RecordStatusChange :exec
INSERT    INTO order_status_history (order_id, status_id)
VALUES    (?, ?);