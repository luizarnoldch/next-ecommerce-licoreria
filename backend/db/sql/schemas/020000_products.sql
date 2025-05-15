-- +goose Up
PRAGMA foreign_keys = ON;

-- Product categories with hierarchy support
CREATE    TABLE categories (
          category_id INTEGER PRIMARY KEY AUTOINCREMENT,
          NAME TEXT NOT NULL,
          parent_id INTEGER,
          FOREIGN KEY (parent_id) REFERENCES categories (category_id)
          );

-- Base products table
CREATE    TABLE products (
          product_id INTEGER PRIMARY KEY AUTOINCREMENT,
          NAME TEXT NOT NULL,
          description TEXT,
          base_price REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

-- Product-category relationships
CREATE    TABLE product_categories (
          product_id INTEGER NOT NULL,
          category_id INTEGER NOT NULL,
          PRIMARY KEY (product_id, category_id),
          FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
          );

-- Product variants (size, color, etc.)
CREATE    TABLE product_variants (
          variant_id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          sku TEXT UNIQUE NOT NULL, -- Stock Keeping Unit
          price REAL NOT NULL,
          attributes TEXT NOT NULL, -- JSON string: {"color": "red", "size": "M"}
          allow_backorder INTEGER DEFAULT 0, -- 1 = allow orders beyond stock
          FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
          );

-- Additional product attributes
CREATE    TABLE product_attributes (
          attribute_id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          attribute_name TEXT NOT NULL,
          attribute_value TEXT NOT NULL,
          FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
          UNIQUE (product_id, attribute_name)
          );

-- Index for SKU lookups
CREATE    INDEX idx_products_sku ON product_variants (sku);

-- +goose Down
DROP      INDEX idx_products_sku;

DROP      TABLE product_attributes;

DROP      TABLE product_variants;

DROP      TABLE product_categories;

DROP      TABLE products;

DROP      TABLE categories;