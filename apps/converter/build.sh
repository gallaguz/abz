#!/bin/bash

docker build --no-cache -f Dockerfile -t abz_converter:latest "$(pwd)"
docker tag abz_converter:latest localhost:5000/abz_converter:latest
docker push localhost:5000/abz_converter:latest
