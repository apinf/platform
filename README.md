[![Stories in Ready](https://badge.waffle.io/apinf/api-umbrella-dashboard.png?label=ready&title=Ready)](https://waffle.io/apinf/api-umbrella-dashboard)
# API Umbrella Dashboard
Dashboard component for the open-source API management platform [API Umbrella](http://nrel.github.io/api-umbrella/).

Documentation
-------------
All planning documents, meeting minutes, etc. can be found on the [Apinf Hackpad](http://apinf.hackpad.com).


Architecture and ecosystem
-------------
Diagrams of the Apinf minimum viable product (MVP) architecture and ecosystem.

Currently, there are two options for the architecture:

* In option A, we will develop our own dashboard and use the API Umbrella Admin API to build Apinf features.
* In option B, we will extend the current API Umbrella Web platform to include a dashboard.

The decision on the architecture to be made once we understand the API Umbrella Admin API better.

![Architecture diagram](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/APINF_MVP_architecture.svg)

For the ecosystem, we will concentrate on open APIs in the MVP phase. For the API consumer side, there are two API consumer personas: [Jukka and Minh](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/UX/APINF%20consumer%20personas.pdf). API owner personas to be added later.

![Ecosystem diagram](https://cdn.rawgit.com/apinf/api-umbrella-dashboard/master/docs/APINF_MVP_ecosystem.svg)

Installation
---
1) Install API Umbrella using the official packages:
http://apiumbrella.io/download/

2) Install Meteor using the official packages:
https://www.meteor.com/install

3) Clone Apinf project repository:
https://github.com/apinf/api-umbrella-dashboard

4) Checkout the 'develop' branch

5) Configure the Meteor/API Umbrella integration plugin by following these instructions:
https://github.com/brylie/meteor-api-umbrella#installation

6) Configure your `settings.json` with the following structure:

```
{
  "api_umbrella": {
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

7) Type `meteor` in the project directory

Nightly build
-------------
You can preview our latest version at [nightly.apinf.com](http://nightly.apinf.com).

* username: test@test.test
* password: testuser
