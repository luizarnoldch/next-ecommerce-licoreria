package config

type (
	CONFIG struct {
		MICRO MICRO
		ENV   string
	}

	MICRO struct {
		DB  DB
		AWS AWS
	}

	AWS struct {
		STACK_NAME            string
		BUCKET_NAME           string
		AWS_REGION            string
		AWS_ACCESS_KEY_ID     string
		AWS_SECRET_ACCESS_KEY string
	}

	DB struct {
		SQLITE SQLITE
	}

	SQLITE struct {
		URI string
	}
)
