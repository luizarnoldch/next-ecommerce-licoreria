-- Add recommendation
-- name: CreateRecommendation :one
INSERT    INTO recommendations (user_id, product_id, score)
VALUES    (?, ?, ?)
RETURNING *;

-- Get user recommendations
-- name: GetRecommendations :many
SELECT    r.*,
          p.name        AS product_name,
          p.base_price,
          p.description
FROM      recommendations r
JOIN      products p ON r.product_id = p.product_id
WHERE     r.user_id = ?
ORDER BY  r.score DESC
LIMIT     ?;

-- Update recommendation score
-- name: UpdateRecommendationScore :exec
UPDATE    recommendations
SET       score = ?
WHERE     recommendation_id = ?;

-- Remove stale recommendations
-- name: RemoveOldRecommendations :exec
DELETE    FROM recommendations
WHERE     created_at < ?;

-- Clear user recommendations
-- name: ClearUserRecommendations :exec
DELETE    FROM recommendations
WHERE     user_id = ?;

-- name: RefreshRecommendations :exec
DELETE    FROM recommendations
WHERE     user_id = ?;