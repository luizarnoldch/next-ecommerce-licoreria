package seed

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"main/db"
	"strings"
)

type variantDef struct {
	Sku            string
	Price          float64
	Attributes     string
	AllowBackorder sql.NullInt64
}

type productDef struct {
	Name         string
	Description  sql.NullString
	BasePrice    float64
	Variants     []variantDef
	Attributes   map[string]string
	CategoryPath []string // e.g. ["Electronics", "Smartphones"]
}

type CategoryTree struct {
	Name     string
	ParentID sql.NullInt64
	ID       int64
	Children map[string]*CategoryTree
}

func ProductInjection(ctx context.Context, dbClient *db.Queries) {
	// Create category hierarchy
	categoryRoot := createCategoryHierarchy(ctx, dbClient)

	products := getProductDefinitions()

	for i, p := range products {
		// Get final category ID from path
		categoryID, err := getCategoryIDFromPath(categoryRoot, p.CategoryPath)
		if err != nil {
			log.Fatalf("[%d] Product %s: %v", i+1, p.Name, err)
		}

		seedProduct(ctx, dbClient, p, categoryID, i+1)
	}

	log.Println("All products seeded successfully.")
}

func createCategoryHierarchy(ctx context.Context, dbClient *db.Queries) *CategoryTree {
	// Define your category hierarchy here
	hierarchy := []struct {
		Path []string
	}{
		{Path: []string{"Electronics", "Smartphones"}},
		{Path: []string{"Electronics", "Laptops"}},
		{Path: []string{"Electronics", "Tablets"}},
		{Path: []string{"Home & Garden", "Kitchen", "Cookware"}},
		{Path: []string{"Home & Garden", "Kitchen", "Small Appliances"}},
		{Path: []string{"Clothing", "Men", "Shirts"}},
		{Path: []string{"Clothing", "Women", "Dresses"}},
	}

	root := &CategoryTree{Children: make(map[string]*CategoryTree)}

	for _, h := range hierarchy {
		current := root
		var parentID sql.NullInt64

		for _, name := range h.Path {
			if current.Children[name] == nil {
				// Create category if it doesn't exist
				cat, err := dbClient.CreateCategory(ctx, name, parentID)
				if err != nil {
					log.Fatalf("CreateCategory (%s): %v", name, err)
				}

				current.Children[name] = &CategoryTree{
					Name:     name,
					ParentID: parentID,
					ID:       cat.CategoryID,
					Children: make(map[string]*CategoryTree),
				}
				fmt.Printf("Created category: %s (ID: %d)\n", name, cat.CategoryID)
			}
			parentID = sql.NullInt64{Int64: current.Children[name].ID, Valid: true}
			current = current.Children[name]
		}
	}
	return root
}

func getCategoryIDFromPath(root *CategoryTree, path []string) (int64, error) {
	current := root
	for _, name := range path {
		if current.Children[name] == nil {
			return 0, fmt.Errorf("category path not found: %v", path)
		}
		current = current.Children[name]
	}
	return current.ID, nil
}

func getProductDefinitions() []productDef {
	return []productDef{
		// Smartphones
		{
			Name:         "iPhone 15",
			Description:  sql.NullString{String: "Latest Apple smartphone with A16 chip", Valid: true},
			BasePrice:    999.99,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "IP15-BLK-256", Price: 1099.99, Attributes: `{"color":"black","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "IP15-WHT-256", Price: 1099.99, Attributes: `{"color":"white","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "IP15-BLU-512", Price: 1299.99, Attributes: `{"color":"blue","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "IP15-PRP-256", Price: 1149.99, Attributes: `{"color":"purple","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "IP15-RED-128", Price: 999.99, Attributes: `{"color":"red","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Apple", "warranty": "1 year", "waterproof": "IP68"},
		},
		{
			Name:         "Galaxy S25",
			Description:  sql.NullString{String: "Next-gen Samsung flagship", Valid: true},
			BasePrice:    899.50,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "GS25-WHT-128", Price: 949.50, Attributes: `{"color":"white","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "GS25-BLK-256", Price: 1049.50, Attributes: `{"color":"black","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "GS25-GRN-512", Price: 1199.50, Attributes: `{"color":"green","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "GS25-SLV-128", Price: 949.50, Attributes: `{"color":"silver","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Samsung", "warranty": "2 years", "spen": "included"},
		},
		{
			Name:         "Pixel 10",
			Description:  sql.NullString{String: "Google's newest phone with clean Android", Valid: true},
			BasePrice:    799.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "PX10-BLU-128", Price: 849.00, Attributes: `{"color":"blue","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "PX10-OBS-256", Price: 949.00, Attributes: `{"color":"obsidian","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "PX10-SNO-512", Price: 1099.00, Attributes: `{"color":"snow","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Google", "warranty": "1 year", "camera": "50MP main"},
		},
		{
			Name:         "OnePlus 12",
			CategoryPath: []string{"Electronics", "Smartphones"},
			Description:  sql.NullString{String: "Flagship phone with Snapdragon 8 Gen 2", Valid: true},
			BasePrice:    799.00,
			Variants: []variantDef{
				{Sku: "OP12-GRY-256", Price: 849.00, Attributes: `{"color":"gray","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "OP12-EMR-512", Price: 949.00, Attributes: `{"color":"emerald","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "OP12-BLK-128", Price: 799.00, Attributes: `{"color":"black","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "OnePlus", "warranty": "2 years", "charging": "80W fast"},
		},
		{
			Name:         "Xiaomi Mi 12",
			Description:  sql.NullString{String: "Xiaomi's premium model with 120Hz display", Valid: true},
			BasePrice:    749.99,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "XM12-BLK-128", Price: 799.99, Attributes: `{"color":"black","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "XM12-WHT-256", Price: 899.99, Attributes: `{"color":"white","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "XM12-BLU-512", Price: 999.99, Attributes: `{"color":"blue","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Xiaomi", "warranty": "1 year", "cooling": "liquid"},
		},
		{
			Name:         "Huawei P50",
			Description:  sql.NullString{String: "Huawei's flagship with Leica camera", Valid: true},
			BasePrice:    899.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "HW50-SIL-256", Price: 949.00, Attributes: `{"color":"silver","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "HW50-GLD-512", Price: 1099.00, Attributes: `{"color":"gold","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "HW50-BLK-128", Price: 899.00, Attributes: `{"color":"black","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Huawei", "warranty": "1 year", "camera": "Leica"},
		},
		{
			Name:         "Sony Xperia 1 IV",
			Description:  sql.NullString{String: "4K OLED display with pro-grade camera", Valid: true},
			BasePrice:    1299.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "SX1IV-PUR-512", Price: 1399.00, Attributes: `{"color":"purple","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "SX1IV-BLK-1TB", Price: 1599.00, Attributes: `{"color":"black","storage":"1TB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "SX1IV-WHT-256", Price: 1349.00, Attributes: `{"color":"white","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Sony", "warranty": "1 year", "display": "4K OLED"},
		},
		{
			Name:         "Motorola Edge 30",
			Description:  sql.NullString{String: "Slim design with 144Hz display", Valid: true},
			BasePrice:    699.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "ME30-BLU-128", Price: 749.00, Attributes: `{"color":"blue","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "ME30-PRP-256", Price: 799.00, Attributes: `{"color":"purple","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "ME30-GRY-128", Price: 749.00, Attributes: `{"color":"gray","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Motorola", "warranty": "1 year", "refresh_rate": "144Hz"},
		},
		{
			Name:         "Nokia X20",
			Description:  sql.NullString{String: "Durable phone with 3 years of updates", Valid: true},
			BasePrice:    499.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "NKX20-GRN-64", Price: 549.00, Attributes: `{"color":"green","storage":"64GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "NKX20-BLK-128", Price: 599.00, Attributes: `{"color":"black","storage":"128GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "NKX20-SND-64", Price: 549.00, Attributes: `{"color":"sand","storage":"64GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Nokia", "warranty": "3 years", "durability": "military-grade"},
		},
		{
			Name:         "Asus ROG Phone 6",
			Description:  sql.NullString{String: "Gaming phone with RGB lighting", Valid: true},
			BasePrice:    999.00,
			CategoryPath: []string{"Electronics", "Smartphones"},
			Variants: []variantDef{
				{Sku: "ROG6-RED-256", Price: 1099.00, Attributes: `{"color":"red","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "ROG6-BLK-512", Price: 1299.00, Attributes: `{"color":"black","storage":"512GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "ROG6-WHT-1TB", Price: 1499.00, Attributes: `{"color":"white","storage":"1TB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "ROG6-BLU-256", Price: 1099.00, Attributes: `{"color":"blue","storage":"256GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Asus", "warranty": "2 years", "cooling": "vapor-chamber"},
		},

		// Laptops
		{
			Name:         "MacBook Pro 16",
			Description:  sql.NullString{String: "Apple laptop con chip M2 Max", Valid: true},
			BasePrice:    2499.00,
			CategoryPath: []string{"Electronics", "Laptops"},
			Variants: []variantDef{
				{Sku: "MBP16-M2-1TB", Price: 2499.00, Attributes: `{"color":"space gray","storage":"1TB","ram":"32GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "MBP16-M2-2TB", Price: 2999.00, Attributes: `{"color":"silver","storage":"2TB","ram":"64GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "MBP16-M2-4TB", Price: 3499.00, Attributes: `{"color":"space gray","storage":"4TB","ram":"96GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Apple", "processor": "M2 Max", "pantalla": "Liquid Retina XDR"},
		},
		{
			Name:         "Dell XPS 15",
			Description:  sql.NullString{String: "Laptop ultra delgado con pantalla OLED", Valid: true},
			BasePrice:    1999.00,
			CategoryPath: []string{"Electronics", "Laptops"},
			Variants: []variantDef{
				{Sku: "XPS15-BLK-32GB", Price: 2199.00, Attributes: `{"color":"black","storage":"1TB","ram":"32GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "XPS15-WHT-16GB", Price: 1999.00, Attributes: `{"color":"white","storage":"512GB","ram":"16GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "XPS15-BLK-64GB", Price: 2599.00, Attributes: `{"color":"black","storage":"2TB","ram":"64GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Dell", "pantalla": "4K OLED", "peso": "1.8kg"},
		},
		{
			Name:         "Lenovo ThinkPad X1 Carbon",
			Description:  sql.NullString{String: "Laptop empresarial ultraligero", Valid: true},
			BasePrice:    1799.00,
			CategoryPath: []string{"Electronics", "Laptops"},
			Variants: []variantDef{
				{Sku: "TPX1C-BLK-16GB", Price: 1799.00, Attributes: `{"color":"black","storage":"512GB","ram":"16GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "TPX1C-BLK-32GB", Price: 2099.00, Attributes: `{"color":"black","storage":"1TB","ram":"32GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "TPX1C-SLV-32GB", Price: 2199.00, Attributes: `{"color":"silver","storage":"1TB","ram":"32GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Lenovo", "teclado": "iluminado", "peso": "1.1kg"},
		},
		{
			Name:         "Asus ROG Zephyrus G14",
			Description:  sql.NullString{String: "Laptop gaming potente", Valid: true},
			BasePrice:    1599.00,
			CategoryPath: []string{"Electronics", "Laptops"},
			Variants: []variantDef{
				{Sku: "ROG-G14-3060", Price: 1599.00, Attributes: `{"color":"white","storage":"1TB","gpu":"RTX 3060"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "ROG-G14-3070", Price: 1899.00, Attributes: `{"color":"gray","storage":"1TB","gpu":"RTX 3070"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "ROG-G14-3080", Price: 2199.00, Attributes: `{"color":"black","storage":"2TB","gpu":"RTX 3080"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Asus", "refresco": "120Hz", "cooling": "sistema de ventilación mejorado"},
		},
		{
			Name:         "Microsoft Surface Laptop 5",
			Description:  sql.NullString{String: "Laptop elegante con pantalla táctil", Valid: true},
			BasePrice:    1299.00,
			CategoryPath: []string{"Electronics", "Laptops"},
			Variants: []variantDef{
				{Sku: "SURF5-PLT-512", Price: 1299.00, Attributes: `{"color":"platinum","storage":"512GB","ram":"16GB"}`, AllowBackorder: sql.NullInt64{Int64: 0, Valid: true}},
				{Sku: "SURF5-BLK-1TB", Price: 1599.00, Attributes: `{"color":"black","storage":"1TB","ram":"32GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
				{Sku: "SURF5-GRN-512", Price: 1399.00, Attributes: `{"color":"green","storage":"512GB","ram":"16GB"}`, AllowBackorder: sql.NullInt64{Int64: 1, Valid: true}},
			},
			Attributes: map[string]string{"brand": "Microsoft", "pantalla": "PixelSense", "touch": "sí"},
		},
	}
}

func seedProduct(
	ctx context.Context,
	dbClient *db.Queries,
	p productDef,
	categoryID int64,
	index int,
) {
	// Create base product
	prod, err := dbClient.CreateProduct(ctx, p.Name, p.Description, p.BasePrice)
	if err != nil {
		log.Fatalf("[%d] CreateProduct (%s): %v", index, p.Name, err)
	}
	fmt.Printf("[%d] Created product: %+v\n", index, prod)

	// Assign categories using helper
	assignCategories(ctx, dbClient, prod.ProductID, []int64{categoryID}, index)

	// Create variants using helper
	createVariants(ctx, dbClient, prod.ProductID, p.Variants, index)

	// Add attributes using helper
	addAttributes(ctx, dbClient, prod.ProductID, p.Attributes, index)

	fmt.Printf("[%d] Successfully seeded %s in %s\n",
		index,
		p.Name,
		strings.Join(p.CategoryPath, " > "))
}

func assignCategories(
	ctx context.Context,
	dbClient *db.Queries,
	productID int64,
	categoryIDs []int64,
	index int,
) {
	for _, catID := range categoryIDs {
		err := dbClient.AssignProductCategory(ctx, productID, catID)
		if err != nil {
			log.Fatalf("[%d] AssignProductCategory: %v", index, err)
		}
	}
}

func createVariants(
	ctx context.Context,
	dbClient *db.Queries,
	productID int64,
	variants []variantDef,
	index int,
) {
	for _, v := range variants {
		params := db.CreateProductVariantParams{
			ProductID:      productID,
			Sku:            v.Sku,
			Price:          v.Price,
			Attributes:     v.Attributes,
			AllowBackorder: v.AllowBackorder,
		}

		variant, err := dbClient.CreateProductVariant(ctx, params)
		if err != nil {
			log.Fatalf("[%d] CreateProductVariant (%s): %v", index, v.Sku, err)
		}
		fmt.Printf("[%d] Created variant: %+v\n", index, variant)
	}
}

func addAttributes(
	ctx context.Context,
	dbClient *db.Queries,
	productID int64,
	attributes map[string]string,
	index int,
) {
	for name, value := range attributes {
		err := dbClient.AddProductAttribute(ctx, productID, name, value)
		if err != nil {
			log.Fatalf("[%d] AddProductAttribute (%s): %v", index, name, err)
		}
	}
}
