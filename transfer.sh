if [[ $CIRCLE_BRANCH == 'staging' ]]
then
  echo PORT=5001 >> .env
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-staging
elif [[ $CIRCL_BRANCH == 'master' ]]
  echo PORT=5000 >> .env
  rsync -va --delete ./ circleci@api.backtalk.io:~/backtalk-api
fi