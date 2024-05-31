#!/bin/bash

docker build --no-cache -f Dockerfile -t abz_api:latest "$(pwd)"
docker tag abz_api:latest localhost:5000/abz_api:latest
docker push localhost:5000/abz_api:latest

docker build --no-cache -f Dockerfile.seed -t abz_seed:latest "$(pwd)"
docker tag abz_seed:latest localhost:5000/abz_seed:latest
docker push localhost:5000/abz_seed:latest
