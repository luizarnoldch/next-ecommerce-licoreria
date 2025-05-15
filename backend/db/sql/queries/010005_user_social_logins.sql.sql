-- Add Social Login
-- name: AddUserSocialLogin :exec
INSERT    INTO user_social_logins (user_id, provider, provider_id)
VALUES    (?, ?, ?) ON CONFLICT (provider, provider_id)
DO        NOTHING;

-- Get Social Logins by User
-- name: GetUserSocialLogins :many
SELECT    *
FROM      user_social_logins
WHERE     user_id = ?;

-- Find User by Social Login
-- name: FindUserBySocial :one
SELECT    u.*
FROM      users u
JOIN      user_social_logins s ON u.user_id = s.user_id
WHERE     s.provider = ? AND      
          s.provider_id = ?;

-- Remove Social Login
-- name: RemoveUserSocialLogin :exec
DELETE    FROM user_social_logins
WHERE     social_id = ?;