#!/bin/bash

# Copyright 2017 Apinf Oy
#This file is covered by the EUPL license.
#You may obtain a copy of the licence at
#https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11

set -ev

echo "docker_build.sh - kissa1"

sudo apt-get install -y --no-install-recommends bsdtar
sudo -i export tar='bsdtar'
tar --version
bsdtar --version

echo "df -h starts, woow!"
df -h

docker build -t apinf/platform:$DOCKER_TAG .
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"

if [ "${TRAVIS_PULL_REQUEST}" = "false" -a "${TRAVIS_REPO_SLUG}" = "apinf/platform" ]
then
  docker push apinf/platform:$DOCKER_TAG
fi
