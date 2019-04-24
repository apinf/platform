# A base Docker image for Meteor applications. https://hub.docker.com/r/jshimko/meteor-launchpad/
FROM abernix/meteord:onbuild
# the version (that bit after :) is dependent somehow on meteor versions. it used to be 1.1.1 but now as we go for Meteor 1.8, let's use latest.
# If you get in trouble with starting Meteor, this might be something to look at
MAINTAINER apinf <info@apinf.io>
