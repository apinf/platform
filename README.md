[![Gitter](https://img.shields.io/badge/GITTER-JOIN_CHAT_%E2%86%92-1dce73.svg)](https://gitter.im/apinf/public)

[![Build Status](https://travis-ci.org/apinf/api-umbrella-dashboard.svg?branch=feature%2F631-nightly-deployment)](https://travis-ci.org/apinf/api-umbrella-dashboard) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/apinf/api-umbrella-dashboard/develop/LICENSE) [![Docs Status](https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat)](http://apinf.org/docs/)

# Links
- [Documentation](http://apinf.org/docs) - APInf documentation
- [Discussion](http://community.apinf.io) - APInf discussion
- [Apinf Hackpad](http://apinf.hackpad.com) - Planning documents, meeting minutes
- [Sprint planning](https://waffle.io/apinf/api-umbrella-dashboard) - waffle.io sprint plans

# API Umbrella Dashboard
The APInf platform offers a comprehensive tool for API management. Building on [API Umbrella](http://nrel.github.io/api-umbrella/), it provides enhanced user interface features for API managers and consumers alike.

For API consumers APInf provides simple key management, key usage analytics and API discovery along with API documentation. Managers have simplified workflow for common tasks, such as key management, rate limiting and viewing API usage analytics.


# Development status
[![Stories in Ready](https://badge.waffle.io/apinf/api-umbrella-dashboard.png?label=ready&title=Ready)](https://waffle.io/apinf/api-umbrella-dashboard)

[![Throughput Graph](https://graphs.waffle.io/apinf/api-umbrella-dashboard/throughput.svg)](https://waffle.io/apinf/api-umbrella-dashboard/metrics)

# Architecture and ecosystem
Diagrams of the Apinf minimum viable product (MVP) architecture and ecosystem.

![System diagram](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/outreach/system-diagram-simplified.svg)

![Technology stack](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/outreach/technology-stack.svg)

For the ecosystem, we will concentrate on open APIs in the MVP phase. For the API consumer side, there are two API consumer personas: [Jukka and Minh](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/UX/APINF%20consumer%20personas.pdf). API owner personas to be added later.

![Ecosystem diagram](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/APINF_MVP_ecosystem.svg)

# Installation

## From Source Code

1. Install [API Umbrella](http://apiumbrella.io/download/) (or follow the [Developer Setup](http://apiumbrella.io/docs/development-setup/))
2. Install [Meteor.js](https://www.meteor.com/install)
3. Clone [Apinf](https://github.com/apinf/api-umbrella-dashboard)
4. Run `npm install`
5. Type `meteor` in the project directory

## With Docker

1. Install [Docker Engine for your OS](https://docs.docker.com/engine/installation/)
2. Run API-umbrella container http://api-umbrella.readthedocs.io/en/latest/getting-started.html#running-with-docker
3. Obtaining API Key and Authentication token. You can obtain the *Authentication Token* and *API Key* from the API Umbrella platform by following instructions in the [Getting Started](http://apiumbrella.io/docs/getting-started/) and [API Umbrella Admin API](http://apiumbrella.io/docs/admin-api/) documentation.
4. Run APInf container ```docker run -p 8080:80 -e MONGO_URL=mongodb://localhost:27017/your_db -e MAIL_URL=smtp://some.mailserver.com:25 -e ROOT_URL=http://YOUR_SITE_DOMAIN apinf/apinf:latest```
5. Configure APInf

# Configure APInf

Register a new admin account. The first user will become Admin.

 1. Signup to the APInf http://YOUR_SITE_DOMAIN/sign-up
 2. Login to the APInf web admin http://YOUR_SITE_DOMAIN/sign-in
 3. Fill APInf settings http://YOUR_SITE_DOMAIN/settings

## mail
The mail object contains a username and password for the Mailgun service. You will need to register with Mailgun. Once registered, you can use your 'sandbox' domain credentials in a development environment or a custom domain in production:

* Default SMTP Login
* Default Password

For up-to-date instructions, refer to the [Mailgun Help Center](https://help.mailgun.com/hc/en-us)

## elasticsearch
Elasticsearch takes a host value that contains the host and port of the API Umbrella ElasticSearch instance. In a standard API Umbrella deployment, this will be the same as the API Umbrella base URL, with port number 14002. **Note:** Elastic REST API may be exposed via HTTP instead of HTTPS, so double check the protocol.

## githubConfiguration
The Github configuration takes two values, a Client ID and Secret key. You can obtain these values by setting up a Github application from your Github user account.

# Nightly build
You can preview our latest version at [nightly.apinf.io](http://nightly.apinf.io).

* username: test@test.test
* password: testuser

# Contributing
Please review our [Contributor Guide](https://github.com/apinf/docs/blob/master/docs/develop/contributing.md) for details on how to get involved with the project.
