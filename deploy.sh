#!/bin/bash
if [[ $CIRCLE_BRANCH == 'staging' ]]; then
  ssh circleci@api.backtalk.io < ./staging.sh
elif [[ $CIRCLE_BRANCH == 'master' ]]; then
  ssh circleci@api.backtalk.io < ./master.sh
fi

