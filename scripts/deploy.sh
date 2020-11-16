#!/bin/bash
if [[ $CIRCLE_BRANCH == 'develop' ]]; then
  ssh circleci@api.backtalk.io < ./scripts/staging.sh
elif [[ $CIRCLE_BRANCH == 'master' ]]; then
  ssh circleci@api.backtalk.io < ./scripts/production.sh
fi

