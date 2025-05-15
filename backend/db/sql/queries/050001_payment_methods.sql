-- Create payment method (Admin only)
-- name: CreatePaymentMethod :one
INSERT    INTO payment_methods (NAME, is_active)
VALUES    (?, ?)
RETURNING *;

-- List active payment methods
-- name: ListActivePaymentMethods :many
SELECT    *
FROM      payment_methods
WHERE     is_active = 1
ORDER BY  NAME;

-- Update payment method status
-- name: UpdatePaymentMethodStatus :exec
UPDATE    payment_methods
SET       is_active = ?
WHERE     method_id = ?;

-- Get payment method by ID
-- name: GetPaymentMethodByID :one
SELECT    *
FROM      payment_methods
WHERE     method_id = ?;