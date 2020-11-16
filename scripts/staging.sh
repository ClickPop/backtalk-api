#!/bin/bash
cd backtalk-develop
docker-compose down
docker-compose up -d --build
rm .env