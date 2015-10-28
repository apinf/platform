# API Umbrella Dashboard
The APInf platform offers a comprehensive tool for API management. Building on [API Umbrella](http://nrel.github.io/api-umbrella/), it provides enhanced user interface features for API managers and consumers alike.

For API consumers APInf provides simple key management, key usage analytics and API discovery along with API documentation. Managers have simplified workflow for common tasks, such as key management, rate limiting and viewing API usage analytics.

# Documentation

All planning documents, meeting minutes, etc. can be found on the [Apinf Hackpad](http://apinf.hackpad.com).

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

1. Install [API Umbrella](http://apiumbrella.io/download/) (or follow the [Developer Setup](http://apiumbrella.io/docs/development-setup/))
2. Install [Meteor.js](https://www.meteor.com/install)
3. Clone [Apinf](https://github.com/apinf/api-umbrella-dashboard)
4. Create [`settings.json`](#Settings.json)
5. Type `meteor --settings /path/to/settings.json` in the project directory

# Settings.json

Your `settings.json` file should have the following structure:

```
{
  "apinf": {
    "host": "https://example.com/"
  },
  "api_umbrella": {
    "host": "https://example.com/"
    "api_key": "xxx",
    "auth_token": "xxx",
    "base_url": "https://example.com/api-umbrella/"
  },
  "mail": {
    "username": "xxx",
    "password": "xxx"
  },
  "elasticsearch": {
    "host": "http://example.com:14002/"
  },
  "githubConfiguration": {
    "clientId" : "xxx",
    "secret" : "xxx"
  }
}
```

## api_umbrella
The `api_umbrella` settings include an API Key, Admin Auth Token, and API Umbrella base URL. You can get the API Key and Admin Auth Token from API Umbrella, by following the instructions in the [Meteor - API Umbrella integration package](https://github.com/brylie/meteor-api-umbrella#installation).

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
Please review our [Contributor Guid](https://github.com/apinf/docs/blob/master/docs/develop/contributing.md) for details on how to get involved with the project.
