if [[ $CIRCLE_BRANCH -eq 'staging' ]]
then
  cd backtalk-staging
elif [[ $CIRCL_BRANCH -eq 'master' ]]
  cd backtalk-api
fi

docker-compose down
docker-compose up -d --build
rm .env