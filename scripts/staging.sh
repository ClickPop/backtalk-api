#!/bin/bash
cd backtalk-staging
docker-compose down
docker-compose up -d --build
rm .env