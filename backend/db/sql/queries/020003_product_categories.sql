-- Assign Category to Product
-- name: AssignProductCategory :exec
INSERT    INTO product_categories (product_id, category_id)
VALUES    (?, ?) ON CONFLICT
DO        NOTHING;

-- Get Product Categories
-- name: GetProductCategories :many
SELECT    c.*
FROM      categories c
JOIN      product_categories pc ON c.category_id = pc.category_id
WHERE     pc.product_id = ?;

-- Remove Category from Product
-- name: RemoveProductCategory :exec
DELETE    FROM product_categories
WHERE     product_id = ? AND      
          category_id = ?;

-- Get Products in Category
-- name: GetCategoryProducts :many
SELECT    p.*
FROM      products p
JOIN      product_categories pc ON p.product_id = pc.product_id
WHERE     pc.category_id = ?;