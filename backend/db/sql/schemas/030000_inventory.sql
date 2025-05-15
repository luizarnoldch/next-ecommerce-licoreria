-- +goose Up
PRAGMA foreign_keys = ON;

-- Physical storage locations
CREATE    TABLE inventory_locations (
          location_id INTEGER PRIMARY KEY AUTOINCREMENT,
          NAME TEXT NOT NULL,
          city TEXT NOT NULL,
          region TEXT NOT NULL
          );

-- Stock tracking per variant and location
CREATE    TABLE stock (
          stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
          variant_id INTEGER NOT NULL,
          location_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          low_stock_threshold INTEGER DEFAULT 10,
          low_stock_alert INTEGER GENERATED ALWAYS AS (quantity < low_stock_threshold),
          FOREIGN KEY (variant_id) REFERENCES product_variants (variant_id) ON DELETE CASCADE,
          FOREIGN KEY (location_id) REFERENCES inventory_locations (location_id) ON DELETE CASCADE
          );

-- Index for low stock monitoring
CREATE    INDEX idx_stock_alert ON stock (low_stock_alert);

-- +goose Down
DROP      INDEX idx_stock_alert;

DROP      TRIGGER trg_low_stock_alert;

DROP      TABLE stock;

DROP      TABLE inventory_locations;