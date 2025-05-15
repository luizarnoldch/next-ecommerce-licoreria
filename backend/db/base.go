package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	_ "github.com/tursodatabase/go-libsql"
)

var (
	instance *Queries
	once     sync.Once
)

func GetLocalTursoClient(uri string) *Queries {
	once.Do(func() {
		wd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Error obteniendo directorio de trabajo: %v", err)
		}

		if !filepath.IsAbs(uri) && strings.HasPrefix(uri, "file:") {
			pathPart := strings.SplitN(uri, "file:", 2)[1]
			absPath := filepath.Join(wd, pathPart)

			uri = fmt.Sprintf("file:%s", absPath)
		}

		db, err := sql.Open("libsql", uri)
		if err != nil {
			log.Fatalf("Error abriendo conexión a la base de datos: %v", err)
		}

		if err := db.Ping(); err != nil {
			log.Fatalf("Error verificando conexión: %v", err)
		}

		instance = New(db)
	})

	return instance
}
