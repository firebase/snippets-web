#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

git add .

if [[ $(git diff --stat HEAD) != '' ]]; then
  git diff --stat HEAD
  echo
  echo 'Error: git diff is dirty ... did you forget to run "npm run snippets" after adding snippets?'
  exit 1
else
  echo 'Succes: git diff is clean'
fi
