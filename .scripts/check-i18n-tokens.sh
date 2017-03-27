#!/bin/bash

# Copyright 2017 Apinf Oy
#This file is covered by the EUPL license.
#You may obtain a copy of the licence at
#https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11

fileEnI18n="core/lib/i18n/en.i18n.json"

echo "Tokens that should be added on en.i18n.json file:"
echo ""

# Find i18n tokens in html files and create a list of tokens names
tokensHtmlFiles=$(grep -iRoh '{{ *_ .*}}' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g")
# Iterate the tokens name list
for token in $tokensHtmlFiles; do
  # Check if the token is not present in en.i18n.json file
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

# Find i18n tokens in js files and create a list of tokens names
tokensJsFiles=$(grep -iRoh 'TAPi18n\.__(.*)' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g")
# Iterate the tokens name list
for token in $tokensJsFiles; do
  # Check if the token is not present in en.i18n.json file
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

echo ""
echo "Tokens that should be removed from en.i18n.json file:"
echo ""


json=$(<$fileEnI18n)

# Iterate all i18n tokens got from en.i18n.json file
echo $json | jq 'keys | .[]' | sed -e "s@['\"]@@g" | while read -r jsonToken ; do
    if [ "$jsonToken" != "schemas" ]; then

        tokenFound=false
        # Find the token in tokensHtmlFiles list
        for token in $tokensHtmlFiles; do
          if [ "$jsonToken" = "$token" ]; then
            tokenFound=true
          fi
        done
        # Find the token in tokensJsFiles list
        for token in $tokensJsFiles; do
          if [ "$jsonToken" = "$token" ]; then
            tokenFound=true
          fi
        done
        if ! $tokenFound ; then
            echo "$jsonToken"
        fi

    fi
done
