#!/bin/bash

docker build --no-cache -f Dockerfile -t abz_app:latest "$(pwd)" --build-arg VUE_APP_API_URL=${VUE_APP_API_URL}
docker tag abz_app:latest localhost:5000/abz_app:latest
docker push localhost:5000/abz_app:latest
