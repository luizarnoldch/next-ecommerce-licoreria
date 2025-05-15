-- Create Variant
-- name: CreateProductVariant :one
INSERT    INTO product_variants (product_id, sku, price, attributes, allow_backorder)
VALUES    (?, ?, ?, ?, ?)
RETURNING *;

-- Get Variant by SKU
-- name: GetProductVariantBySKU :one
SELECT    *
FROM      product_variants
WHERE     sku = ?;

-- Get Product Variants
-- name: GetProductVariants :many
SELECT    *
FROM      product_variants
WHERE     product_id = ?
ORDER BY  sku;

-- Update Variant
-- name: UpdateProductVariant :one
UPDATE    product_variants
SET       price = COALESCE(?, price),
          attributes = COALESCE(?, attributes),
          allow_backorder = COALESCE(?, allow_backorder)
WHERE     variant_id = ?
RETURNING *;

-- Delete Variant
-- name: DeleteProductVariant :exec
DELETE    FROM product_variants
WHERE     variant_id = ?;