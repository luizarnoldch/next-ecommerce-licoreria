package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"main/config"
	"main/db"

	"main/infrastructure/db_tool/seed"

	_ "github.com/tursodatabase/go-libsql"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	args := os.Args[1:]
	if len(args) < 1 {
		help()
		return
	}

	sub := args[0]
	switch sub {
	case "reset":
		resetDB(cfg)
	case "up", "down":
		runGoose(cfg, sub)
	case "gen":
		runGen()
	case "seed":
		runSeed()
	default:
		help()
	}
}

// swag init -g main.go -o docs

func resetDB(cfg *config.CONFIG) {
	dbPath := strings.TrimPrefix(cfg.MICRO.DB.SQLITE.URI, "file:")
	dbPath = strings.Split(dbPath, "?")[0] // Remove query parameters

	// Delete all possible SQLite files
	extensions := []string{"", "-shm", "-wal"}
	for _, ext := range extensions {
		file := dbPath + ext
		if err := os.Remove(file); err != nil && !os.IsNotExist(err) {
			log.Printf("Warning: Error removing %s: %v", file, err)
		}
	}

	// Create directory structure
	if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
		log.Fatalf("Error creating directories: %v", err)
	}

	// Create empty database file
	file, err := os.Create(dbPath)
	if err != nil {
		log.Fatalf("Error creating database file: %v", err)
	}
	file.Close()

	// Run migrations
	runGoose(cfg, "up")
	log.Printf("Database successfully reset at: %s", dbPath)
}

func runGoose(cfg *config.CONFIG, action string) {
	// Construir cadena de conexión SQLite con parámetros recomendados

	absPath, _ := filepath.Abs(strings.TrimPrefix(cfg.MICRO.DB.SQLITE.URI, "file:"))
	dbUrl := fmt.Sprintf("file:%s?_foreign_keys=1&_journal_mode=WAL", absPath)
	log.Printf("     ** GOOSE %s **", strings.ToUpper(action))

	cmdArgs := []string{
		"-dir", "db/sql/schemas",
		"sqlite3",
		dbUrl,
		action,
	}

	cmd := exec.Command("goose", cmdArgs...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = os.Environ()

	log.Printf("Ejecutando goose %s en '%s'...", action, dbUrl)
	if err := cmd.Run(); err != nil {
		log.Fatalf("Error ejecutando goose %s: %v", action, err)
	}
	log.Printf("goose %s completado exitosamente", action)
}

func runGen() {
	// Change to the db/sql directory
	dir := "db/sql"
	if err := os.Chdir(dir); err != nil {
		log.Fatalf("No se pudo cambiar al directorio %s: %v", dir, err)
	}
	// Create the sqlc generate command
	cmd := exec.Command("sqlc", "generate")
	// Configure outputs and environment
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = os.Environ()
	log.Printf("Generating SQL code with sqlc...")
	// Execute and handle errors
	if err := cmd.Run(); err != nil {
		log.Fatalf("Error ejecutando sqlc generate: %v", err)
	}
	log.Printf("SQL code generation completed successfully")
}

func runSeed() {
	// Load environment configuration
	env, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	ctx := context.Background()
	dbClient := db.GetLocalTursoClient(env.MICRO.DB.SQLITE.URI)

	seed.UserInyection(ctx, dbClient)
	seed.ProductInjection(ctx, dbClient)
}

func help() {
	fmt.Println("Usage: go run main.go <command>")
	fmt.Println("Available commands:")
	fmt.Println("  reset    - Drop and recreate the configured database")
	fmt.Println("  up       - Apply migrations with 'goose up'")
	fmt.Println("  down     - Roll back migrations with 'goose down'")
}
