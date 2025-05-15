-- +goose Up
PRAGMA foreign_keys = ON;

-- Payment method catalog
CREATE    TABLE payment_methods (
          method_id INTEGER PRIMARY KEY AUTOINCREMENT,
          NAME TEXT UNIQUE NOT NULL, -- e.g., 'Credit Card', 'PayPal'
          is_active INTEGER DEFAULT 1
          );

-- Payment transactions log
CREATE    TABLE transactions (
          transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          method_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
          external_id TEXT NOT NULL, -- Payment gateway reference
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
          FOREIGN KEY (method_id) REFERENCES payment_methods (method_id)
          );

-- +goose Down
DROP      TABLE transactions;

DROP      TABLE payment_methods;