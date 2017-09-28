#!/bin/bash

function usage() {
  echo "$0 <project> <api-key> < <rules-file>"
}

PROJECT="$1"
API_KEY="$2"

if [[ -z "${PROJECT// }" ]] || [[ -z "${API_KEY// }" ]]; then
  usage
  exit 1
fi

# Change this to move to nightly/staging/pro
BLADE_TARGET="firebase-rules-multiregion-us-test"
# BLADE_TARGET="firebase-rules-multiregion-us-staging"
#BLADE_TARGET="firebase-rules-multiregion-us"

RULES=""
while read line; do
  if [[ ! -z "$RULES" ]]; then
    RULES="$RULES\n"
  fi
  RULES="$RULES$line"
done

echo "Uploading"
echo "---------------------------------------------"
echo $RULES | sed 's/\\n/\n/g'
echo "---------------------------------------------"
echo ""

/google/data/ro/projects/gaiamint/bin/get_mint --type=loas --text --scopes=35600 --endusercreds --out=/tmp/auth.txt

RESULT=$(stubby call --globaldb --proto2 --rpc_creds_file=/tmp/auth.txt --request_extensions_file <( echo '[google.rpc.context.system_parameter_context] {api_key: "'"$API_KEY"'"}' ) blade:"$BLADE_TARGET" FirebaseRulesService.CreateRuleset --proto2 'name: "projects/'"$PROJECT"'" ruleset { name: "projects/'"$PROJECT"'" source { files { content: "'"$RULES"'" name: "file1" } } }')

RULE_SET=$(echo $RESULT | sed 's/name: "\([^"]*\).*/\1/')
echo "Uploaded ruleset $RULE_SET"

stubby call --globaldb --proto2 --rpc_creds_file=/tmp/auth.txt --request_extensions_file <( echo '[google.rpc.context.system_parameter_context] {api_key: "'"$API_KEY"'"}' ) blade:"$BLADE_TARGET" FirebaseRulesService.CreateRelease --proto2 'name: "projects/'"$PROJECT"'" release { name: "projects/'"$PROJECT"'/releases/cloud.firestore" ruleset_name: "'"$RULE_SET"'" }'

stubby call --globaldb --proto2 --rpc_creds_file=/tmp/auth.txt --request_extensions_file <( echo '[google.rpc.context.system_parameter_context] {api_key: "'"$API_KEY"'"}' ) blade:"$BLADE_TARGET" FirebaseRulesService.UpdateRelease --proto2 'name: "projects/'"$PROJECT"'/releases/cloud.firestore" ruleset_name: "'"$RULE_SET"'"'
