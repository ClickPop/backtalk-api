if [[ $CIRCLE_BRANCH == 'staging' ]]; then
  echo -e "PORT=5001\n
  NODE_ENV=production\n
  API_NAME=backtalk-api-staging\n
  DB_NAME=backtalk-db-staging\n
  DB_LOCATION=../data-staging" >> .env
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-staging
elif [[ $CIRCL_BRANCH == 'master' ]]; then
  echo -e "PORT=5000\n
  NODE_ENV=production\n
  API_NAME=backtalk-api\n
  DB_NAME=backtalk-db\n
  DB_LOCATION=../data" >> .env
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-api
fi