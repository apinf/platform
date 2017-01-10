#!/bin/bash

fileEnI18n="core/lib/i18n/en.i18n.json"

echo "Tokens that should be added on en.i18n.json file:"
echo ""

# FIND TOKENS FROM HTML FILES
tokensHtmlFiles=$(grep -iRoh '{{ *_ .*}}' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g")
for token in $tokensHtmlFiles; do
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

# FIND TOKENS FROM JS FILES
tokensJsFiles=$(grep -iRoh 'TAPi18n\.__(.*)' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g")
for token in $tokensJsFiles; do
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

echo ""
echo "Tokens that should be removed from en.i18n.json file:"
echo ""

# FIND TOKENS FROM en.i18n.json FILE

json=$(<$fileEnI18n)

echo $json | jq 'keys | .[]' | sed -e "s@['\"]@@g" | while read -r jsonToken ; do
    if [ "$jsonToken" != "schemas" ]; then

        # FIND TOKEN IN HTML FILES
        tokenFound=false
        for token in $tokensJsFiles; do
          if [ "$jsonToken" = "$token" ]; then
            tokenFound=true
          fi
        done
        for token in $tokensHtmlFiles; do
          if [ "$jsonToken" = "$token" ]; then
            tokenFound=true
          fi
        done
        if ! $tokenFound ; then
            echo "$jsonToken"
        fi

    fi
done
