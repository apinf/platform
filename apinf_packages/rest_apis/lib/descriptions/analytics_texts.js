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
  getMyOrganizations: `
  ## List User's Organizations
  This method lists User's Organizations in APInf API management catalog.
  The list contains either all Organizations or a set of Organizations limited by a search string.

  The list consists of names and IDs of each Organization meeting the condition.
   `,
  // --------------------------------------------
  getAnalytics: `
  ## List APIs' traffic data on KPI level
  Show key performance indicator (KPI) values and identification information of APIs.

  ### Request parameters

  APIs are listed depending on value given to parameter **apisBy**
  - **organization** = all APIs, *that belong to Organizations*,
  which are managed by User (default value)
  - **owner** = all APIs, which are managed by User

  By using parameter **organizationId** the User can limit the search
  in one Organization in both cases.


  With parameter **period** the User can select the one of three periods,
  over which the data is returned. Periods are calculated by server time.
  - **today** is todays values (default value)
  - **week** is for past week (7 days back beginning from yesterday)
  - **month** (30 days back beginning from yesterday).

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

  Note! When period is set to 'Today' the current day data from midnight
  (on server time) to current moment is returned, not a complete 24 hour period.
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

  With parameter **date** the User can identify a date of which more granular details are fetched.
  The form of value for parameter is given according to ISO 8601, YYYY-MM-DD.
  With parameter user can pick one of days between yesterday to 7 days back from today
  (which, by the way, is same as the range indicated with value *week* of parameter *period*).

  Parameter **date** is obsolete in case parameter *period* was given.

  With parameter **interval** is indicated the granularity of analytic data.
  E.g. when granularity is set to 5, the analytics data is summed up
  for each 5 minutes during the day and returned as a table 12 * 24 lines.
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

  Note! When period is set to 'Today' the current day data from midnight
  (on server time) to current moment is returned, not a complete 24 hour period.
  `,
  // --------------------------------------------
  apisBy: `
  Optional parameter to limit the search to APIs in Organizations
  managed by user (value 'organization') or managed by user (value 'owner').
  *Default value is 'organization'*.
  `,
  date: `
  Date of which detailed information is retrieved. Format: yyyy-mm-dd (Standard: ISO 8601).
  **Note!** If _period_ parameter is used, then _date_ parameter is obsolete.
  `,
  organizationId: `
  Optional parameter to limit the search to one Organization only.
  `,
  period: `
  Predefined periods for detailed API performance data.
  Periods are calculated by server time.
  - **today** is current day values from midnight to current moment. (Default)
  - **week** is past 7 days (does not include current day).
  - **month** is 30 days (does not include current day).
  `,
  startDate: `
  Provide start date value from which the analytics is provided from.
  Date is expected in following format: yyyy-mm-dd, example 2017-11-30
  (Standard: ISO 8601). With *days* parameter you define the period length.

  **Note!** Keep in mind that our platform can provide fast access to
  data only 30 days backwards. Any request going further down the history
  will most likely cause slower API response time.

  **Note!** If you use combination of *startDate* and *days* parameters,
  you can not use *period* parameter.
  `,
  days: `
  Provide number (integer) of days you want to include
  in the result set. The start date defined with *startDate* parameter is
  included in the count.

  **Note!** If you use combination of *startDate* and *days* parameters,
  you can not use *period* parameter.
  `,
  interval: `
  Granularity (in minutes) of the data within a day. Available options are:
  - 5
  - 10
  - 15
  - 30
  - 60

  If granularity interval is not given, default value is 24 hours (1440 minutes), which is by the way the same as to use _today_ option in period parameter.
  **Note!** If _period_ parameter is used, then _interval_ parameter is obsolete.
  `,
};

export default descriptionAnalytics;
