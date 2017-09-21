/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const managementGeneralDescription = `
## What is APInf?

APinf is open source API management and catalog application.
Solution supports both REST and MQTT proxies.
You can have multiple proxies under one management.

----

** Check out free to use community instance at https://apinf.io **

----

### For API owners

APInf provides you with a unified, simple interface for publishing your APIs
to the developer community and performing complex API management tasks.
It allows you to gain a better understanding of your API traffic.

Each organization has an organization page which provides single URL to promote to developers.

## APInf Management REST API

APInf Management REST API enables Organization and User management via simple API.
With this API you can add, list, update and remove (CRUD) catalog content:

* service users and
* information regarding API owner organizations.


### Authentication

Authentication is implemented according to functionality in [Restivus Swagger](https://github.com/apinf/restivus-swagger).
All POST, PUT and DELETE methods require valid authentication.


#### Steps in authentication

1. The user must have a valid user account.
2. The user logs in via API.
* The username and password are given as parameters in login request.
* The login credentials (a **user ID** and an **auth token**) are returned in response.
3. The login credentials are provided as header parameters in request message
in fields **X-User-Id** and **X-Auth-Token**.


### API keys

* We require API key in all GET methods. You can get it by creating an account to Apinf system.
  * Create it now here https://apinf.io/sign-up


### Dates

Dates and times are provided and returned in ISODate format (https://www.iso.org/iso-8601-date-and-time-format.html),
* for example "2012-07-14T01:00:00+01:00" or "2012-07-14".

----

### Examples for each method to get you started

In documentation each method contains simple examples to get you started.
Here's an example.

Example call:

    GET /organizations

Result: returns all Organizations.

----

Responses contain approriate HTTP code and in message payload extended infomation
depending on case.

Successful case:
* HTTP code 2xx
* the payload contains fields (except in HTTP 204 case)
  * status: value "success"
  * data: data of object(s)


Unsuccessful case:
* HTTP code 3xx/4xx/5xx
* the payload contains fields
  * status: value "fail"
  * message: extended information about reason of failure

----
`;

export default managementGeneralDescription;
