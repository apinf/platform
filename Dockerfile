# A base Docker image for Meteor applications. https://hub.docker.com/r/jshimko/meteor-launchpad/
#FROM jshimko/meteor-launchpad:latest - jessie deps
#FROM abernix/meteord:onbuild - is not starting
FROM pixolution/meteor-launchpad:v2.3.1
# the version (that bit after :) is dependent somehow on meteor versions. it used to be 1.1.1 but now as we go for Meteor 1.8, let's use latest.
# If you get in trouble with starting Meteor, this might be something to look at
MAINTAINER apinf <info@apinf.io>
