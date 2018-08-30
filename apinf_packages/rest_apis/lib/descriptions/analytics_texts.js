/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionAnalytics = {
  // --------------------------------------------
  general: `
  ## **APInf Analytics API**

  With APInf Analytics REST API you can retrieve general and detailed
  information about performance of your APIs.
  With this API you can for example to monitor your API performance or to
  export API performance data for external dashboard.

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
  - **organization** = all APIs, *belonging to Organizations* managed by User (default value)
  - **owner** = all APIs, which are managed by User

  In both cases the User can limit the search in one Organization
  by using parameter **organizationId**.


  With parameter **period** the User can select the period (up to 30 days),
  over which the data is returned. Periods are calculated by server time.
  - **0** | **period not given**, data contains todays values,
  i.e. from midnight to moment, when request was sent (default value)
  - **1** to **30**, is period length in full days. Period either ends yesterday
  (when startDate not given) or begins on startDate.

  Suitable values for parameter *period* are 7 (last week) or 28 (four last weeks).
  Note! Todays response dataset will never be complete 24 hours

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

`,
  // --------------------------------------------
  getAnalyticsApiId: `
  ## List API with detailed information
  Show KPI values and detailed information related to one specific API defined by ID.

  ## Approaches

  Select either
  - a period (1 - 30)
  - or a specific date with granularity interval.

  If the parameter *period* is used, the latter two parameters are obsolete.

  ### Request parameters

  API is identified with parameter **apiId**.

  With parameter **period** the User can select length of the period,
  over which the data is returned. Period is calculated based on server time.
  - **0** is todays data (default value)
  - **1** - **30** is length of period, ending yesterday (yesterday included)

  With parameter **date** the User can identify a date of which more granular details are fetched.
  The form of value for parameter is given according to ISO 8601, YYYY-MM-DD.
  With parameter user can pick one of days between yesterday to 30 days back from today.

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

  Delta values, i.e. comparison of summaries between selected period and previous period.
  Comparison result is shown as percentage.
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
  getAnalyticsApiIdRaw: `
  ## List API analytics data within given period
  Return analytics data records of API (of given id) within given period.

  ## Approaches

  ### Request parameters

  - **apiId** identifies the API

  - **fromDate** is the start date of period
  - **toDate** is the end date of period
  - **limit** is (maximum) number of records in response, max. 10000
  - **skip** is number of records to skip for pagination.

  The given dates are included in period, from beginning of start date to end of end date
  according to server time.
  In case toDate is not given, the period length is only one day, the start day.

  ### Response content
  General information of response:
  - limit is maximum number or records in response
  - skip is number of records to skipped for pagination
  - returned is number of records the response contains
  - left is number of records not yet returned
  - found is number of all records matching to search conditions

  Following data is returned of each call of API in question:
  - timestamp
  - the used method
  - response size
  - HTTP code of response
  - request query parameters (if exist)
  - the API URL (proxy base path)

  `,
  // --------------------------------------------
  apisBy: `
  Optional parameter to limit the search to APIs either in Organizations
  managed by user (value 'organization') or managed by user (value 'owner').
  *Default value is 'organization'*.
  `,
  apiId: `
  Mandatory parameter to limit the search to one API only.
  `,
  date: `
  Date of which detailed information is retrieved. Format: yyyy-mm-dd (Standard: ISO 8601).
  **Note!** If _period_ parameter is used, then _date_ parameter is obsolete.
  `,
  fromRawDate: `
  Date from which the raw information retrieval period begins.
  Given date is included in the period from previous midnight (server time).
  Format: yyyy-mm-dd (Standard: ISO 8601).
  `,
  interval: `
  Granularity (in minutes) of the data within a day. Available options are:
  - 30
  - 60

  If granularity interval is not given, default value is 24 hours (1440 minutes),
  which is by the way the same as to use (1 - 30) option in parameter _period_.
  **Note!** If _period_ parameter is used, then _interval_ parameter is obsolete.
  `,
  organizationId: `
  Optional parameter to limit the search to one Organization only.
  `,
  period: `
  Optional parameter to indicate the period (in days) for detailed API performance data.
  Periods are calculated **based on server time**.
  There are two ways to use the parameter
  - **0** | **not given**, period contains only current day from midnight to current moment.
  (Default value, startDate is obsolete)
  - **1** - **30**, period length is given number of days.

  On latter alternative the beginning and ending of period depends on
  whether parameter *startDate* is given.
  - without *startDate* the period ends yesterday (also including it)
  - with *startDate* the period begins on given date (also including it),
  but it must not exceed yesterday.
`,
  periodApiId: `
  Predefined periods for detailed API performance data.
  Periods are calculated based on server time.
  - **0** is current day data from midnight to current moment.
  - **1** - **30** period length is given number of days (yesterday as last included day)
  `,
  startDate: `
  Optional parameter to indicate the *date* from which the provided analytics period begins.
  Date value is expected in following format: yyyy-mm-dd, example 2017-11-30 (Standard: ISO 8601).

  **Note!** Keep in mind that our platform can provide fast access to data only 30 days backwards.
  Any request going further down the history will most likely cause slower API response time.

  **Note!** Parameter *period* must be used to define the period length.

  **Note!** In case parameter *period* has value 0 or it is not given, parameter StartDate
  is obsolete.

  **Note!** Period formed with parameters startDate and Period can not contain current day.
  `,
  toRawDate: `
  Date to which the raw information retrieval period ends.
  Given date is included in the period up to midnight (server time).
  Format: yyyy-mm-dd (Standard: ISO 8601).
  If not given, the default value is now (the moment the command was given).
  `,
};

export default descriptionAnalytics;
