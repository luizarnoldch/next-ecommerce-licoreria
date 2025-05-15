package config

type (
	CONFIG struct {
		MICRO MICRO
		ENV   string
	}

	MICRO struct {
		DB DB
	}
	DB struct {
		SQLITE SQLITE
	}

	SQLITE struct {
		URI string
	}
)
