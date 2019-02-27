<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
  - [From Source Code](#from-source-code)
  - [With Docker](#with-docker)
    - [Configure APInf](#configure-apinf)
  - [With Docker Compose](#with-docker-compose)
  - [mail](#mail)
  - [elasticsearch](#elasticsearch)
  - [githubConfiguration](#githubconfiguration)
- [Development installation with Docker](#development-installation-with-docker)
  - [Install Docker](#install-docker)
  - [Install Docker Compose](#install-docker-compose)
    - [Ubuntu](#ubuntu)
  - [Edit API Umbrella configuration](#edit-api-umbrella-configuration)
  - [Prepare APInf image](#prepare-apinf-image)
    - [See Docker IP address (step only for Mac)](#see-docker-ip-address-step-only-for-mac)
    - [Set hosts](#set-hosts)
  - [Create API Umbrella credentials](#create-api-umbrella-credentials)
  - [Debugging containers with docker exec](#debugging-containers-with-docker-exec)
  - [Building Docker Images](#building-docker-images)
    - [Building Images](#building-images)
    - [Pushing to Docker Hub](#pushing-to-docker-hub)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

## Note on migration
We are in the process of updating meteor version from 1.5.2 to 1.8. If you need to update the installation which is based on Meteor 1.5.2 to version which uses Meteor 1.8, you need to run Mongo migration. More information here: https://docs.mongodb.com/manual/release-notes/3.6-upgrade-standalone/

The issue is that new version of Mongo which comes with Meteor version 1.8 has new database engine; Procedure is to 1) mongo dump 2) upgrade to version with meteor 1.8 3)meteor reset 4) mongo restore 

## Note on different Umbrella versions
We have branched the NREL/api-umbrella: https://github.com/apinf/api-umbrella APInf fork; We have removed mongodb from the umbrella image. You should deploy mongo in another container/machine and configure umbrella to use that external instance of mongo.

## From Source Code

1. Install [API Umbrella](http://apiumbrella.io/download/) (or follow the [Developer Setup](http://apiumbrella.io/docs/development-setup/))
2. Install [Meteor.js](https://www.meteor.com/install)
3. Clone [Apinf](https://github.com/apinf/platform)
4. Run `meteor npm install` - using meteor instead npm makes sure the same npm is used that comes with meteor distribution
5. Type `meteor` in the project directory

## With Docker

1. Run API-umbrella container http://api-umbrella.readthedocs.io/en/latest/getting-started.html#running-with-docker
2. Obtaining API Key and Authentication token. You can obtain the *Authentication Token* and *API Key* from the API Umbrella platform by following instructions in the [Getting Started](http://apiumbrella.io/docs/getting-started/) and [API Umbrella Admin API](http://apiumbrella.io/docs/admin-api/) documentation.
3. Run APInf container ```docker run -p 8080:80 -e MONGO_URL=mongodb://localhost:27017/your_db -e MAIL_URL=smtp://some.mailserver.com:25 -e ROOT_URL=http://YOUR_SITE_DOMAIN apinf/platform:latest```
4. Configure APInf

### Configure APInf

Register a new admin account. The first user will become Admin.

 1. Signup to the APInf http://YOUR_SITE_DOMAIN/sign-up
 2. Login to the APInf web admin http://YOUR_SITE_DOMAIN/sign-in
 3. Fill APInf settings http://YOUR_SITE_DOMAIN/settings

## With Docker Compose
1. Create "docker-compose.yml" file on your server and copy content from [docker-compose.yml](https://github.com/apinf/platform/blob/develop/docker-compose.yml).
2. In the same folder create file "docker/api-umbrella/config/api-umbrella.yml" based on example "docker/api-umbrella/config/api-umbrella.yml.example". ATTENTION: replace "example.com" on YOUR_SITE_DOMAIN for keys "ssl_cert" and "ssl_cert_key".
3. Create file "docker/env.apinf" based on example "docker/env.apinf.example".
4. Create file "docker/env.ssl" based on example "docker/env.ssl.example".
5. Run ```docker-compose up -d```. The first launch of will be slow because (take couple of minutes) of the DH parameter computation and configure Let's Encrypt certificate.
6. Visit https://YOUR_SITE_DOMAIN:3002/signup/ and fill form for get API Key.
7. Visit https://YOUR_SITE_DOMAIN:3002/admin/ and click on 'My Account' link for find Admin API Token.
8. Visit https://YOUR_SITE_DOMAIN/sign-up and create new account.
9. Fill data in "Project Branding: APInf Configuration Wizard".
10. Fill data in "Settings for API Umbrella: APInf Configuration Wizard".
* Host: "https://YOUR_SITE_DOMAIN:3002"
* API Key: from step #6
* Auth Token: from step #7
* Base URL: "https://YOUR_SITE_DOMAIN:3002/api-umbrella/"
* Elasticsearch: "http://elasticsearch.docker:9200"
11. Add API backend https://YOUR_SITE_DOMAIN/api/new


## mail
The mail object contains a username and password for the Mailgun service. You will need to register with Mailgun. Once registered, you can use your 'sandbox' domain credentials in a development environment or a custom domain in production:

* Default SMTP Login
* Default Password

For up-to-date instructions, refer to the [Mailgun Help Center](https://help.mailgun.com/hc/en-us)

## elasticsearch
Elasticsearch takes a host value that contains the host and port of the API Umbrella ElasticSearch instance. In a standard API Umbrella deployment, this will be the same as the API Umbrella base URL, with port number 14002. **Note:** Elastic REST API may be exposed via HTTP instead of HTTPS, so double check the protocol.

## githubConfiguration
The Github configuration takes two values, a Client ID and Secret key. You can obtain these values by setting up a Github application from your Github user account.

# Development installation with Docker

## Install Docker
Review the Docker installation instructions for your Operating System:
* [Mac](https://docs.docker.com/installation/mac/) ([Activates NFS on docker-machine](https://github.com/adlogix/docker-machine-nfs))
* [Linux](https://docs.docker.com/installation/ubuntulinux/)

Optionally [add your user to the `docker` group](https://docs.docker.com/engine/installation/linux/ubuntulinux/#create-a-docker-group).

## Install Docker Compose
You will also need to [install Docker Compose](https://docs.docker.com/compose/install/).
### Ubuntu
Install Docker Compose on Ubuntu Linux with the following command:

```
$ sudo apt install docker-compose
```

## Edit API Umbrella configuration

API Umbrella configuration should be stored in
* ```[project-root]/docker/api-umbrella/config/api-umbrella.yml```

You can create `api-umbrella.yml` based on the example:
* ```[project-root]/docker/api-umbrella/config/api-umbrella.yml.example```

## Prepare APInf image

1. Run application containers (in first time it will build image):
  ```
  $ docker-compose up
  ```
2. Add `apinf.dev` and `api-umbrella.dev` hosts entry to `/etc/hosts` file so you can visit them from your browser.


### See Docker IP address (step only for Mac)
```
$ docker-machine ip
=> 127.0.0.1
```

### Set hosts

Then add the IP to your `/etc/hosts`:
```
127.0.0.1 apinf.dev api-umbrella.dev
```

Now you can work with your app from browser by visit http://apinf.dev:3000

## Create API Umbrella credentials

1. [Login to the API Umbrella web admin](http://api-umbrella.readthedocs.org/en/latest/getting-started.html#login-to-the-web-admin) https://api-umbrella.dev/admin/login
2. Signup to the APInf http://apinf.dev:3000/sign-up
3. Login to the APInf web admin http://apinf.dev:3000/sign-in
4. Fill API Umbrella settings http://apinf.dev:3000/settings :

* Host: https://api-umbrella.dev
* API Key: [Get from step](http://api-umbrella.readthedocs.org/en/latest/getting-started.html#signup-for-an-api-key).
* Auth Token: Get from [My account page](https://api-umbrella.dev/admin)
* Base URL: https://api-umbrella.dev
* Elasticsearch Host: http://api-umbrella.dev:14002

## Debugging containers with docker exec

This can be accomplished by grabbing the container ID with a docker ps, then passing that ID into the docker exec command:

```
$ docker ps
CONTAINER ID        IMAGE
ce9de67fdcbe        apinf/platform:latest
$ docker exec -it ce9de67fdcbe /bin/bash
root@ce9de67fdcbe:/#
```

Add alias to bash:
```
alias apinf_web='docker exec -it `docker ps | grep web | sed "s/ .*//"` /bin/bash'
```

## Building Docker Images

### Building Images

To build packages for the current APInf version:

```
$ docker build -t apinf/platform:INSERT_VERSION_HERE .
$ docker tag apinf/platform:INSERT_VERSION_HERE apinf/platform:latest
```

### Pushing to Docker Hub

To publish the new images to our [Docker Hub repository](https://hub.docker.com/r/apinf/platform/):

```
$ docker push apinf/platform:INSERT_VERSION_HERE
$ docker push apinf/platform:latest
```
