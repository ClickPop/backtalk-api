#!/bin/bash
cd backtalk-develop
docker-compose up -d --build --force-recreate
rm .env