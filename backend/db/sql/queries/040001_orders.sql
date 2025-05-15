-- Create order
-- name: CreateOrder :one
INSERT    INTO orders (user_id, guest_order_id, total, current_status_id)
VALUES    (
          ?,
          ?,
          ?,
          (
          SELECT    status_id
          FROM      order_status
          WHERE     status_name = 'pending'
          )
          )
RETURNING *;

-- Get order by ID
-- name: GetOrder :one
SELECT    o.*,
          u.email       AS user_email,
          g.email       AS guest_email,
          s.status_name
FROM      orders o
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN guest_orders g ON o.guest_order_id = g.guest_order_id
JOIN      order_status s ON o.current_status_id = s.status_id
WHERE     o.order_id = ?;

-- Update order status
-- name: UpdateOrderStatus :one
UPDATE    orders
SET       current_status_id = ?
WHERE     order_id = ?
RETURNING *;

-- List user orders
-- name: ListUserOrders :many
SELECT    *
FROM      orders
WHERE     user_id = ?
ORDER BY  created_at DESC;

-- List guest orders
-- name: ListGuestOrders :many
SELECT    *
FROM      orders
WHERE     guest_order_id = ?
ORDER BY  created_at DESC;

-- Cancel order
-- name: CancelOrder :exec
UPDATE    orders
SET       current_status_id = (
          SELECT    status_id
          FROM      order_status
          WHERE     status_name = 'cancelled'
          )
WHERE     order_id = ?;

-- Sales report
-- name: SalesOrderReport :many
SELECT    DATE (created_at) AS date,
          COUNT(*)          AS order_count,
          SUM(total)        AS total_sales
FROM      orders
WHERE     created_at BETWEEN ? AND ?
GROUP BY  DATE (created_at)
ORDER BY  DATE (created_at);