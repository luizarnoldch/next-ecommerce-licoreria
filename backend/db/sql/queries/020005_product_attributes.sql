-- Add Attribute
-- name: AddProductAttribute :exec
INSERT    INTO product_attributes (product_id, attribute_name, attribute_value)
VALUES    (?, ?, ?) ON CONFLICT (product_id, attribute_name)
DO       
UPDATE   
SET       attribute_value = excluded.attribute_value;

-- Get Product Attributes
-- name: GetProductAttributes :many
SELECT    *
FROM      product_attributes
WHERE     product_id = ?;

-- Remove Attribute
-- name: RemoveProductAttribute :exec
DELETE    FROM product_attributes
WHERE     product_id = ? AND      
          attribute_name = ?;

-- Search by Attribute
-- name: SearchProductByAttribute :many
SELECT    p.*
FROM      products p
JOIN      product_attributes pa ON p.product_id = pa.product_id
WHERE     pa.attribute_name = ? AND      
          pa.attribute_value = ?;