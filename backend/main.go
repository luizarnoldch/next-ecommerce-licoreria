package main

import (
	"fmt"
	"log"
	"main/config"
	"main/db"
	"net/http"

	"main/docs"

	httpSwagger "github.com/swaggo/http-swagger/v2"
	_ "github.com/tursodatabase/go-libsql"
)

func main() {
	env, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	dbClient := db.GetLocalTursoClient(env.MICRO.DB.SQLITE.URI)
	fmt.Println("Database client:", dbClient)

	docs.SwaggerInfo.Title = "Ecommerce API"
	docs.SwaggerInfo.BasePath = ""
	docs.SwaggerInfo.Description = "API para gestionar usuarios (Lambda + API Gateway)."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http"}

	router := http.NewServeMux()

	// Configurar Swagger para servir los archivos estáticos
	router.HandleFunc("/api/docs/", httpSwagger.Handler(
		httpSwagger.URL("/api/docs/doc.json"), // URL relativa
	))

	// Servir el archivo doc.json directamente
	// router.HandleFunc("/api/docs/doc.json", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./docs/swagger.json")
	// })

	// Añadir el endpoint /hello que aparece en la documentación
	router.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Hello, World!"}`))
	})

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	log.Println("Servidor iniciado en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
