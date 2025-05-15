package main

import (
	"fmt"
	"log"
	"main/config"
	"main/db"

	_ "github.com/tursodatabase/go-libsql"
)

func main() {

	env, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	db_client := db.GetLocalTursoClient(env.MICRO.DB.SQLITE.URI)

	fmt.Println(db_client)

}
