#!/bin/bash

echo "Building services sequentially..."

docker-compose build web
docker-compose build api-gateway
docker-compose build auth-service
docker-compose build tasks-service
docker-compose build notifications-service

echo "All builds completed."