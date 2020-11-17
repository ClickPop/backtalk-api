#!/bin/bash
cd backtalk-api
docker-compose up -d --build --force-recreate
rm .env