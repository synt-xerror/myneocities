#!/bin/bash
# deploy.sh
TOKEN="d3bdb344d763b2d3985f4244137bd28d"
SITE="errorsyntax"

# envia todos os arquivos da pasta atual para o site
curl -H "Authorization: Bearer $TOKEN" \
     -F "dir=index.html" \
     -F "file=@index.html" \
     https://neocities.org/api/upload
