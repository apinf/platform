#!/bin/bash

fileEnI18n="core/lib/i18n/en.i18n.json"

echo "Tokens that should be added on en.i18n.json file:"

# FIND TOKENS FROM HTML FILES
grep -iRoh '{{ *_ .*}}' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g" | while read -r token ; do
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

# FIND TOKENS FROM JS FILES
grep -iRoh 'TAPi18n\.__(.*)' * --exclude="*.md" | grep -o "['\"].*['\"]" | sed -e "s@['\"]@@g" | while read -r token ; do
  if ! grep -q "$token" "$fileEnI18n"; then
    echo "$token"
  fi
done

# echo "Tokens that should be removed from en.i18n.json file:"

# FIND TOKENS FROM en.i18n.json FILE
