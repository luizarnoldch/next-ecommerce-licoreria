#!/usr/bin/env bash
set -euo pipefail

# — Parámetros a ajustar —
BUCKET="ecommerce-arnold-s3-bucket"
PREFIX="infrastructure/lambdas"       # ruta dentro del bucket
TEMPLATE_FILE="cognito.yml"           # tu CFN template
STACK_NAME="my-stack"
CAPS="CAPABILITY_NAMED_IAM"

# Si quieres desplegar sólo unas cuantas Lambdas, descomenta y edita:
# LAMBDAS=( post_confirmation get_user_by_email )

# — O bien, lista automáticamente todas las Lambdas (.zip) bajo el prefijo —
if [ "${#LAMBDAS[@]:-0}" -eq 0 ]; then
  mapfile -t LAMBDAS < <(
    aws s3 ls "s3://$BUCKET/$PREFIX/" \
      | awk '/\.zip$/ {print $4}' \
      | sed 's/\.zip$//'
  )
fi

# Construye los overrides: asume que en tu template tienes
# Parameters: PostConfirmationZipVersion, GetUserByEmailZipVersion, etc.
OVERRIDES=()
for name in "${LAMBDAS[@]}"; do
  KEY="$PREFIX/${name}.zip"
  echo "→ Fetching VersionId for $KEY …"
  VERSION=$(aws s3api head-object \
    --bucket "$BUCKET" \
    --key "$KEY" \
    --query VersionId \
    --output text)
  if [[ "$VERSION" == "null" ]]; then
    echo "  ⚠️  Warning: $KEY no tiene versionId (¿subido antes de habilitar versioning?). Skipping." >&2
    continue
  fi
  # Construye el nombre de parámetro en CamelCase exacto como lo definiste en tu template:
  #   post_confirmation  →  PostConfirmationZipVersion
  #   get_user_by_email →  GetUserByEmailZipVersion
  PARAM_NAME="$(echo "${name}_zip_version" \
    | sed -r 's/(^|_)([a-z])/\U\2/g' \
    | sed 's/$/ZipVersion/')"

  echo "  • $PARAM_NAME = $VERSION"
  OVERRIDES+=( "${PARAM_NAME}=${VERSION}" )
done

if [ "${#OVERRIDES[@]}" -eq 0 ]; then
  echo "‼️  No se recopilaron overrides de VersionId. Abortando." >&2
  exit 1
fi

echo
echo "Desplegando CloudFormation con overrides:"
printf '  %s\n' "${OVERRIDES[@]}"
echo

aws cloudformation deploy \
  --stack-name  "$STACK_NAME" \
  --template-file "$TEMPLATE_FILE" \
  --parameter-overrides "${OVERRIDES[@]}" \
  --capabilities "$CAPS"
