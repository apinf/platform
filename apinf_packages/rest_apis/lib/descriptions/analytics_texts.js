/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionAnalytics = {
  // --------------------------------------------
  general: `
  ## What is APInf?

  APinf is open source API management and marketplace application.
Solution supports both REST and MQTT proxies.
You can have multiple proxies under one management.

  ----

  **APInf - API management with free-tier. See more from https://www.apinf.com/pricing**

  ----

  ## **For API owners**

  APInf provides you with a unified, simple interface for publishing
  your APIs to the developer community and performing complex API management tasks.






  It allows you to gain a better understanding of your API traffic.

  Each organization has an organization page which provides single URL to promote to developers.

  ----

  ## **APInf Analytics API**

  With APInf Analytics REST API you can retrieve general and detailed
  information about performance of your APIs.
  With this API you can for example to monitor your API performance or to
  export API performance data for external dashboard.

  API performance data is available on two levels
  - KPI level (**K**ey **P**erformace **I**ndicators)
    - summaries, e.g. number of requests, response time, number of unique users
  - Detailed level
    - in addition to previous, e.g. trend compared between periods
  and data per day with more granularity


   ### Examples for each method to get you started

  Examples assume you have logged in before calling the API.
  Read about authentication below. It is also assumed,
  that while connecting Analytics API to proxy, the "/rest/v1/"
  is included in API base path and in Proxy base path the API is identified with "/analyze/".

  **List APIs showing their Ids and Key Performance Indicator values**


  #### GET /analytics

  <pre>
  curl -X GET https://apinf.io:3002/analyze/analytics
    -H  "accept: application/json"
    -H  "X-API-Key: my-api-key"
    -H  "X-Auth-Token: my-auth-token"
    -H  "X-User-Id: my-user-id"
    -H  "content-type: application/json"
  </pre>







  **List my organizations**

  Endpoint contains search as optional parameter.
  You can use optional organization id in detailed requesting
  analytics only for APIs related to specific organization.
  Here's how to list all your organizations (and IDs) you are involved with.


  #### GET /myOrganizations

  <pre>
  curl -X GET https://apinf.io:3002/analyze/myOrganizations
    -H  "accept: application/json"
    -H  "X-API-Key: my-api-key"
    -H  "X-Auth-Token: my-auth-token"
    -H  "X-User-Id: my-user-id"
    -H  "content-type: application/json"
  </pre>

  **Show KPI values for APIs under one organization**

  You can see KPI values for all APIs under one organization by
  giving organizationId as parameter

  #### GET /analytics?organizationId=2

  <pre>
  curl -X GET https://apinf.io:3002/analyze/my-organizations?organizationId=2
    -H  "accept: application/json"
    -H  "X-API-Key: my-api-key"
    -H  "X-Auth-Token: my-auth-token"
    -H  "X-User-Id: my-user-id"
    -H  "content-type: application/json"
  </pre>


  **Show detailed analytics for one API**

  You can see detailed analytics data for one API by adding
  API Id as path parameter. With additional query parameters you can
  limit the results. See /analytics/{apiID} endpoint for details.







  #### GET /analytics/2


  <pre>
  curl -X GET https://apinf.io:3002/analyze/analytics/2
    -H  "accept: application/json"
    -H  "X-API-Key: my-api-key"
    -H  "X-Auth-Token: my-auth-token"
    -H  "X-User-Id: my-user-id"
    -H  "content-type: application/json"
  </pre>


  ## **Authentication**

  Authentication is implemented according to functionality
  in [Restivus Swagger](https://github.com/apinf/restivus-swagger).
  All POST, PUT and DELETE methods require valid authentication.


  ### Steps in authentication

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





  
    `,
  // --------------------------------------------
  getAnalytics: `
  ### Adds a new User account ###

  With this method a new user account is created.

  Parameters:
  * all parameters are mandatory
  * *username* must be unique
  * *email address* must be unique
  * *password* must be at least 6 characters long

  On a successful case a response message with HTTP code 201 is returned.



  Payload contains the data of created User account.
  `,
  // --------------------------------------------
  getAnalyticsApiId: `
  ## List API with detailed information






  Show KPI values and detailed information related to one specific API defined by ID.

  ## Approaches

  Select either
  - a predefined period (today, week, month)
  - or a specific date with granularity interval.


  If the parameter *period* is used, the latter two parameters are obsolete.



  ### Request parameters

  API is identified with parameter **apiId**.

  With parameter **period** the User can select the one of three periods,
  over which the data is returned. Periods are calculated by server time.
  - **Today** is todays values (default value)
  - **Week** is for past week (7 days back beginning from yesterday)
  - **month** (30 days back beginning from yesterday).

  With parameter **date** the User can identify a date of which more granular
  details are fetched.
  The form of value for parameter is given according to ISO 8601, YYYY-MM-DD.
  With parameter user can pick one of days between yesterday to 7 days back from today
  (which, by the way, is same as the range indicated with value *week* of parameter *period*).

  Parameter **date** is obsolete in case parameter *period* was given.

  With parameter **interval** is indicated the granularity of analytic data.
  E.g. when granularity is set to 5, the analytics data is summed up for each 5 minutes
  during the day and returned as a table 12 * 24 lines.
  Accordingly when granularity is set to 60 (an hour), the returned table contains 24 lines.

  Parameter **interval** is obsolete in case parameter *period* was given.

  ### Response content
  The response contains meta data



  - the API URL (proxy base path)
  - name of API
  - ID of API
  - data interval (here always 1440, i.e. a day)







  In addition to that, the response contains summaries during the selected period

  - number of requests



  - median response time
  - number of unique users

  Delta values, i.e. comparison of summaries between previous and selected periods.
  - change in number of requests
  - change in median response time
  - change in number of unique users

  Information about frequent users as array of

  - users email address



  - number of calls made
  - request path

  Error statistics as array of
  - timestamp
  - HTTP code
  - number of calls
  - request path

  Details per endpoints for each day within period per given interval
  - number of requests
  - number of unique users
  - responses divided by HTTP code (2xx, 3xx, 4xx, 5xx)
  - response times (shortest, median, 95 percentile and longest)

  Note! When period is set to 'Today' the current day data from midnight (on server time)
   to current moment is returned, not a complete 24 hour period.

  `,
};

export default descriptionAnalytics;
