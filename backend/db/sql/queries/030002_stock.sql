-- Create stock entry
-- name: CreateStockEntry :one
INSERT    INTO stock (variant_id, location_id, quantity, low_stock_threshold)
VALUES    (?, ?, ?, ?)
RETURNING *;

-- Get stock for variant at location
-- name: GetStockEntry :one
SELECT    *
FROM      stock
WHERE     variant_id = ? AND      
          location_id = ?;

-- Update stock quantity (absolute)
-- name: SetStockQuantity :exec
UPDATE    stock
SET       quantity = ?
WHERE     variant_id = ? AND      
          location_id = ?;

-- Adjust stock (relative)
-- name: AdjustStock :exec
UPDATE    stock
SET       quantity = quantity + ?
WHERE     variant_id = ? AND      
          location_id = ?;

-- Get low stock alerts
-- name: ListLowStock :many
SELECT    s.*,
          v.sku,
          p.name AS product_name,
          l.name AS location_name
FROM      stock s
JOIN      product_variants v ON s.variant_id = v.variant_id
JOIN      products p ON v.product_id = p.product_id
JOIN      inventory_locations l ON s.location_id = l.location_id
WHERE     s.low_stock_alert = 1;

-- Get all stock for variant
-- name: GetVariantStock :many
SELECT    s.*,
          l.name AS location_name,
          l.city AS location_city
FROM      stock s
JOIN      inventory_locations l ON s.location_id = l.location_id
WHERE     variant_id = ?;

-- Delete stock entry
-- name: DeleteStockEntry :exec
DELETE    FROM stock
WHERE     stock_id = ?;