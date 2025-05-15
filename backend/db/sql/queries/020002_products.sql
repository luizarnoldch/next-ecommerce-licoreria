-- Create Product
-- name: CreateProduct :one
INSERT    INTO products (NAME, description, base_price)
VALUES    (?, ?, ?)
RETURNING *;

-- Get Product by ID
-- name: GetProduct :one
SELECT    *
FROM      products
WHERE     product_id = ?;

-- List Products with Pagination
-- name: ListProducts :many
SELECT    *
FROM      products
ORDER BY  created_at DESC
LIMIT     ?
OFFSET    ?;

-- Update Product Details
-- name: UpdateProduct :one
UPDATE    products
SET       NAME = COALESCE(?, NAME),
          description = COALESCE(?, description),
          base_price = COALESCE(?, base_price)
WHERE     product_id = ?
RETURNING *;

-- Delete Product (cascades to variants/categories)
-- name: DeleteProduct :exec
DELETE    FROM products
WHERE     product_id = ?;