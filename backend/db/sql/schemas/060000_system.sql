-- +goose Up
PRAGMA foreign_keys = ON;

-- System audit log
CREATE    TABLE logs (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action_type TEXT NOT NULL, -- e.g., 'login', 'order_update'
          details TEXT NOT NULL, -- JSON-formatted details
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL
          );

-- Product recommendations engine
CREATE    TABLE recommendations (
          recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          score REAL NOT NULL CHECK (score BETWEEN 0 AND 1), -- Recommendation strength
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products (product_id)
          );

-- +goose Down
DROP      TABLE recommendations;

DROP      TABLE logs;