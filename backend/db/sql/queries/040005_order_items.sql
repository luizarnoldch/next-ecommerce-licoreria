-- Add item to order
-- name: AddOrderItem :one
INSERT    INTO order_items (order_id, variant_id, quantity, price)
VALUES    (?, ?, ?, ?)
RETURNING *;

-- Update item quantity
-- name: UpdateItemQuantity :exec
UPDATE    order_items
SET       quantity = ?
WHERE     item_id = ?;

-- Get order items
-- name: GetOrderItems :many
SELECT    i.*,
          v.sku,
          p.name       AS product_name,
          v.attributes
FROM      order_items i
JOIN      product_variants v ON i.variant_id = v.variant_id
JOIN      products p ON v.product_id = p.product_id
WHERE     order_id = ?;

-- Remove item from order
-- name: RemoveOrderItem :exec
DELETE    FROM order_items
WHERE     item_id = ?;

-- Popular products
-- name: PopularProductOrders :many
SELECT    v.variant_id,
          v.sku,
          p.name,
          SUM(i.quantity) AS total_sold
FROM      order_items i
JOIN      product_variants v ON i.variant_id = v.variant_id
JOIN      products p ON v.product_id = p.product_id
GROUP BY  v.variant_id
ORDER BY  total_sold DESC
LIMIT     ?;