#!/bin/bash

# Copyright 2017 Apinf Oy
#This file is covered by the EUPL license.
#You may obtain a copy of the licence at
#https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11

set -ev

if [ "${TRAVIS_OS_NAME}" = "linux" ]; then
  sh -e /etc/init.d/xvfb start
  sleep 3
fi
