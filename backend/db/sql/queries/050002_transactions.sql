-- Record payment transaction
-- name: CreateTransaction :one
INSERT    INTO transactions (order_id, method_id, amount, status, external_id)
VALUES    (?, ?, ?, ?, ?)
RETURNING *;

-- Update transaction status
-- name: UpdateTransactionStatus :exec
UPDATE    transactions
SET       status = ?
WHERE     transaction_id = ?;

-- Get transaction by ID
-- name: GetTransactionByID :one
SELECT    t.*,
          m.name  AS payment_method,
          o.total AS order_total
FROM      transactions t
JOIN      payment_methods m ON t.method_id = m.method_id
JOIN      orders o ON t.order_id = o.order_id
WHERE     t.transaction_id = ?;

-- Get order payment history
-- name: GetTransactionsByOrder :many
SELECT    t.*,
          m.name AS payment_method
FROM      transactions t
JOIN      payment_methods m ON t.method_id = m.method_id
WHERE     t.order_id = ?
ORDER BY  t.created_at DESC;

-- Find failed transactions
-- name: GetFailedTransactions :many
SELECT    t.*,
          m.name           AS payment_method,
          o.guest_order_id,
          u.email          AS user_email
FROM      transactions t
JOIN      payment_methods m ON t.method_id = m.method_id
JOIN      orders o ON t.order_id = o.order_id
LEFT JOIN users u ON o.user_id = u.user_id
WHERE     t.status = 'failed';

-- Find transaction by gateway reference
-- name: FindTransactionByExternalID :one
SELECT    *
FROM      transactions
WHERE     external_id = ?;

-- name: GetDailyPaymentReport :many
SELECT    DATE (t.created_at) AS payment_date,
          m.name              AS METHOD,
          COUNT(*) FILTER     (
          WHERE     t.status = 'success'
          ) AS success_count,
          SUM(t.amount) FILTER (
          WHERE     t.status = 'success'
          ) AS success_total,
          COUNT(*) FILTER (
          WHERE     t.status = 'failed'
          ) AS failed_count,
          SUM(t.amount) FILTER (
          WHERE     t.status = 'failed'
          ) AS failed_total
FROM      transactions t
JOIN      payment_methods m ON t.method_id = m.method_id
WHERE     t.created_at BETWEEN ? AND ?
GROUP BY  payment_date,
          METHOD
ORDER BY  payment_date DESC;