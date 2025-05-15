-- Create guest order
-- name: CreateGuestOrder :one
INSERT    INTO guest_orders (email, encrypted_address)
VALUES    (?, ?)
RETURNING *;

-- Get guest order
-- name: GetGuestOrder :one
SELECT    *
FROM      guest_orders
WHERE     guest_order_id = ?;