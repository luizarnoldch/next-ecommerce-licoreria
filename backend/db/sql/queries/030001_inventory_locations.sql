-- Create new inventory location
-- name: CreateLocation :one
INSERT    INTO inventory_locations (NAME, city, region)
VALUES    (?, ?, ?)
RETURNING *;

-- Get location by ID
-- name: GetLocationByID :one
SELECT    *
FROM      inventory_locations
WHERE     location_id = ?;

-- List all locations
-- name: ListLocations :many
SELECT    *
FROM      inventory_locations
ORDER BY  region,
          city,
          NAME;

-- Update location details
-- name: UpdateLocation :one
UPDATE    inventory_locations
SET       NAME = COALESCE(?, NAME),
          city = COALESCE(?, city),
          region = COALESCE(?, region)
WHERE     location_id = ?
RETURNING *;

-- Delete location (cascades to stock records)
-- name: DeleteLocation :exec
DELETE    FROM inventory_locations
WHERE     location_id = ?;