-- +goose Up
PRAGMA foreign_keys = ON;

-- Guest checkout records
CREATE    TABLE guest_orders (
          guest_order_id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          encrypted_address TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

-- Order status catalog
CREATE    TABLE order_status (
          status_id INTEGER PRIMARY KEY AUTOINCREMENT,
          status_name TEXT UNIQUE NOT NULL -- e.g., 'pending', 'shipped', 'cancelled'
          );

INSERT    INTO order_status (status_name)
VALUES    ('pending'),
          ('processing'),
          ('shipped'),
          ('delivered'),
          ('cancelled') ON CONFLICT
DO        NOTHING;

-- Main orders table
CREATE    TABLE orders (
          order_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          guest_order_id INTEGER,
          total REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          current_status_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
          FOREIGN KEY (guest_order_id) REFERENCES guest_orders (guest_order_id) ON DELETE SET NULL,
          FOREIGN KEY (current_status_id) REFERENCES order_status (status_id),
          CHECK (
          user_id IS NOT NULL OR       
          guest_order_id IS NOT NULL
          )
          );

-- Order status history tracking
CREATE    TABLE order_status_history (
          history_id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          status_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
          FOREIGN KEY (status_id) REFERENCES order_status (status_id)
          );

-- Individual order items
CREATE    TABLE order_items (
          item_id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          variant_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
          FOREIGN KEY (variant_id) REFERENCES product_variants (variant_id)
          );

-- Index for order date filtering
CREATE    INDEX idx_orders_date ON orders (created_at);

-- +goose Down
DROP      INDEX idx_orders_date;

DROP      TRIGGER trg_order_status_update;

DROP      TABLE order_items;

DROP      TABLE order_status_history;

DROP      TABLE orders;

DROP      TABLE order_status;

DROP      TABLE guest_orders;