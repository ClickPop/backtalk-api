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
REFRESH_TOKEN_EXPIRATION=$REFRESH_TOKEN_EXPIRATION\n
NODE_ENV=production\n
NODE_COMMAND=npm start\n
PASSWORD_RESET_EXPIRY=10\n
SENDGRID_KEY=$SENDGRID_KEY" > .env

# Handle whether we are on the develop or master branch
if [[ $CIRCLE_BRANCH == 'develop' ]]; then
  echo -e "PORT=5001\n
DB_PORT=5432\n
DB_HOST=backtalk-db-develop\n
API_NAME=backtalk-api-develop\n
DB_NAME=backtalk-db-develop\n
DB_LOCATION=/data-develop\n
RESET_EMAIL_URL=https://develop.backtalk.io/password-reset/" >> .env
  
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-develop
elif [[ $CIRCLE_BRANCH == 'master' ]]; then
  echo -e "PORT=5000\n
DB_PORT=5432\n
DB_HOST=backtalk-db\n
API_NAME=backtalk-api\n
DB_NAME=backtalk-db\n
DB_LOCATION=/data\n
RESET_EMAIL_URL=https://backtalk.io/password-reset/" >> .env
  
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-api
fi