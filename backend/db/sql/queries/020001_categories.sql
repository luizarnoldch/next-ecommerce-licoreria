-- Create Category
-- name: CreateCategory :one
INSERT    INTO categories (NAME, parent_id)
VALUES    (?, ?)
RETURNING *;

-- Update Category
-- name: UpdateCategory :one
UPDATE    categories
SET       NAME = COALESCE(?, NAME),
          parent_id = COALESCE(?, parent_id)
WHERE     category_id = ?
RETURNING *;

-- Delete Category (automatically removes product associations via CASCADE)
-- name: DeleteCategory :exec
DELETE    FROM categories
WHERE     category_id = ?;