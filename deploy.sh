if [[ $CIRCLE_BRANCH == 'staging' ]]; then
  cd backtalk-staging
elif [[ $CIRCL_BRANCH == 'master' ]]; then
  cd backtalk-api
fi

docker-compose down
docker-compose up -d --build
rm .env