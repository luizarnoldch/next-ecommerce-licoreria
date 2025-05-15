-- +goose Up
PRAGMA foreign_keys = ON;

-- User roles table (admin, customer, etc.)
CREATE    TABLE user_roles (role_id INTEGER PRIMARY KEY AUTOINCREMENT, role_name TEXT UNIQUE NOT NULL);

-- Main users table
CREATE    TABLE users (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          NAME TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME,
          is_active INTEGER DEFAULT 1 -- 1 = true, 0 = false
          );

-- User-role mapping table
CREATE    TABLE user_role_assignments (
          user_id INTEGER NOT NULL,
          role_id INTEGER NOT NULL,
          PRIMARY KEY (user_id, role_id),
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
          FOREIGN KEY (role_id) REFERENCES user_roles (role_id) ON DELETE CASCADE
          );

-- User addresses with encrypted fields
CREATE    TABLE user_addresses (
          address_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          encrypted_address TEXT NOT NULL, -- AES-256 encrypted
          city TEXT NOT NULL,
          region TEXT NOT NULL,
          phone BLOB, -- AES-256 encrypted binary storage
          is_default INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
          );

-- Social login integrations
CREATE    TABLE user_social_logins (
          social_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          provider TEXT NOT NULL,
          provider_id TEXT NOT NULL,
          UNIQUE (provider, provider_id),
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
          );

-- Index for faster email lookups
CREATE    INDEX idx_users_email ON users (email);

-- +goose Down
DROP      INDEX idx_users_email;

DROP      TABLE user_social_logins;

DROP      TABLE user_addresses;

DROP      TABLE user_role_assignments;

DROP      TABLE users;

DROP      TABLE user_roles;