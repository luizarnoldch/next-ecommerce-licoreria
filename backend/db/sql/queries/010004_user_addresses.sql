-- Add Address
-- name: CreateUserAddress :one
INSERT    INTO user_addresses (user_id, encrypted_address, city, region, phone, is_default)
VALUES    (?, ?, ?, ?, ?, ?)
RETURNING *;

-- Get User Addresses
-- name: GetUserAddresses :many
SELECT    *
FROM      user_addresses
WHERE     user_id = ?
ORDER BY  is_default DESC,
          created_at DESC;

-- Update Address
-- name: UpdateUserAddress :one
UPDATE    user_addresses
SET       encrypted_address = COALESCE(?, encrypted_address),
          city = COALESCE(?, city),
          region = COALESCE(?, region),
          phone = COALESCE(?, phone),
          is_default = COALESCE(?, is_default)
WHERE     address_id = ?
RETURNING *;

-- Set Default Address
-- name: SetDefaultUserAddress :exec
UPDATE    user_addresses
SET       is_default = CASE
                    WHEN address_id = ? THEN 1
                    ELSE 0
          END
WHERE     user_id = ?;

-- Delete Address
-- name: DeleteUserAddress :exec
DELETE    FROM user_addresses
WHERE     address_id = ?;