# Installation

## From Source Code

1. Install [API Umbrella](http://apiumbrella.io/download/) (or follow the [Developer Setup](http://apiumbrella.io/docs/development-setup/))
2. Install [Meteor.js](https://www.meteor.com/install)
3. Clone [Apinf](https://github.com/apinf/api-umbrella-dashboard)
4. Run `npm install`
5. Type `meteor` in the project directory

## With Docker

1. Run API-umbrella container http://api-umbrella.readthedocs.io/en/latest/getting-started.html#running-with-docker
2. Obtaining API Key and Authentication token. You can obtain the *Authentication Token* and *API Key* from the API Umbrella platform by following instructions in the [Getting Started](http://apiumbrella.io/docs/getting-started/) and [API Umbrella Admin API](http://apiumbrella.io/docs/admin-api/) documentation.
3. Run APInf container ```docker run -p 8080:80 -e MONGO_URL=mongodb://localhost:27017/your_db -e MAIL_URL=smtp://some.mailserver.com:25 -e ROOT_URL=http://YOUR_SITE_DOMAIN apinf/apinf:latest```
4. Configure APInf

### Configure APInf

Register a new admin account. The first user will become Admin.

 1. Signup to the APInf http://YOUR_SITE_DOMAIN/sign-up
 2. Login to the APInf web admin http://YOUR_SITE_DOMAIN/sign-in
 3. Fill APInf settings http://YOUR_SITE_DOMAIN/settings

## With Docker Compose
1. Create "docker-compose.yml" file on your server and copy content from [docker-compose.yml](https://github.com/apinf/api-umbrella-dashboard/blob/develop/docker-compose.yml).
2. In the same folder create file "docker/api-umbrella/config/api-umbrella.yml" based on example "docker/api-umbrella/config/api-umbrella.yml.example". ATTENTION: replace "example.com" on YOUR_SITE_DOMAIN for keys "ssl_cert" and "ssl_cert_key".
3. Create file "docker/apinf/env" based on example "docker/apinf/env.example".
4. Create file "docker/ssl/env" based on example "docker/ssl/env.example".
5. Run ```docker-compose up -d```. The first launch of will be slow because (take couple of minutes) of the DH parameter computation and configure Let's Encrypt certificate.
6. Visit https://YOUR_SITE_DOMAIN:3002/signup/ and fill form for get API Key.
7. Visit https://YOUR_SITE_DOMAIN:3002/admin/ and click on 'My Account' link for find Admin API Token.
8. Visit https://YOUR_SITE_DOMAIN/sign-up and create new account.
9. Fill data in "Project Branding: APINF Configuration Wizard".
10. Fill data in "Settings for API Umbrella: APINF Configuration Wizard".
* Host: "https://YOUR_SITE_DOMAIN:3002"
* API Key: from step #6
* Auth Token: from step #7
* Base URL: "https://YOUR_SITE_DOMAIN:3002/api-umbrella/"
* Elasticsearch: "http://YOUR_SITE_DOMAIN:14002"
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
