#!/bin/bash
# Build out basic .env file
echo -e "DB_USERNAME=$DB_USERNAME\n
DB_PASSWORD=$DB_PASSWORD\n
DB_DATABASE=$DB_DATABASE\n
HASH_SECRET=$HASH_SECRET\n
ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET\n
REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET\n
COOKIE_SECRET=$COOKIE_SECRET\n
ACCESS_TOKEN_EXPIRATION=$ACCESS_TOKEN_EXPIRATION\n
REFRESH_TOKEN_EXPIRATION=$REFRESH_TOKEN_EXPIRATION\n" > .env

# Handle whether we are on the develop or master branch
if [[ $CIRCLE_BRANCH == 'develop' ]]; then
  echo -e "PORT=5001\n
DB_HOST=backtalk-db-staging\n
NODE_ENV=production\n
API_NAME=backtalk-api-staging\n
DB_NAME=backtalk-db-staging\n
DB_LOCATION=/data-staging" >> .env
  
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-staging
elif [[ $CIRCLE_BRANCH == 'master' ]]; then
  echo -e "PORT=5000\n
DB_HOST=backtalk-db\n
NODE_ENV=production\n
API_NAME=backtalk-api\n
DB_NAME=backtalk-db\n
DB_LOCATION=/data" >> .env
  
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-api
fi