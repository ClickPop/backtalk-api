#!/bin/bash
cd backtalk-api
docker-compose down
docker-compose up -d --build
rm .env