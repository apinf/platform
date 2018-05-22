/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionApis = {
  // --------------------------------------------
  getAll: `
  ### Searches and lists APIs ###

  Parameters are optional and also combinations of parameters can be used.
  In case Admin user sends the request, also private APIs are listed.

  Example call:

      GET /apis?limit=200&managedAPIs=true

  Result: returns maximum of 200 APIs which are managed by requesting user.

  -----

  Note! The field X-User-Id in message header can be used
  * to contain required Manager's user ID with parameter managedAPIs provided
  * to contain Admin user's ID, when indicated, that user is Admin
  `,
  // --------------------------------------------
  get: `
  ### Lists data of API with specified ID ###

  Returns the API with specified ID, if a match is found. In case API is private,
  only Admin user or API manager can get it.

  Example call:

      GET /apis/:id

  Result: returns the data of API identified with :id.

  Note! The field X-User-Id in message header can be used
  * to contain Admin/Manager user's ID, when indicated, that user is Admin/Manager
  `,
  // --------------------------------------------
  post: `
  ### Adds a new API to Catalog ###

  Adds an API to catalog. On success, returns the added API object.


  Parameters
  * mandatory: *name* and *url*
  * length of *description* must not exceed 1000 characters
  * value of *lifecycleStatus* must be one of example list
  * *isPublic*, ["true" |"false"]
    * if isPublic is set false, only admin or manager can see the API
  * *documentationUrl* contains a http(s) link to OpenAPI (or Swagger) documentationUrl
  * *externalDocument* contains a http(s) link for other types of documentation
  `,
  // --------------------------------------------
  put: `
  ### Updates an API ###

  Admin or API manager can update an API in catalog.
  On success, returns the updated API object.

  Parameters
  * length of *description* must not exceed 1000 characters
  * value of *lifecycleStatus* must be one of example list
  * *isPublic*, ["true" | "false"]
    * if isPublic is set false, only admin or manager can see the API
  * *documentationUrl* contains a http(s) link to OpenAPI (or Swagger) documentationUrl
  * *externalDocument* contains a http(s) link for other types of documentation

  `,
  // --------------------------------------------
  delete: `
  ### Deletes an API ###

  Admin user or API manager can delete an identified API from the Catalog.

  Example call:

    DELETE /apis/<API id>

  Result: deletes the API identified with <API id> and responds with HTTP code 204.

  If match is not found, the operation is considered as failed.
  `,
  // --------------------------------------------
  deleteDocumentation: `
  ### Removes documentation of an API ###

  Admin user or API manager can remove whole documentation or part of it of an identified API.
  On success returns API object.

  Example calls:

    DELETE /apis/<API id>/documents

  Result: Removes all documentation of the API identified with <API id>
  and responds with HTTP code 200.


    DELETE /apis/<API id>/documents?url=http://link-to-documentation

  Result: Removes (if finds the match of) the mentioned documentation link of the API identified
  with <API id> and responds with HTTP code 200.

  Order of finding the match for the link
  - openAPI documentation (documentationUrl)
  - external documentation links

  If match is not found, the operation is considered as failed.
  `,
  // --------------------------------------------
  getProxyBackend: `
  ### Lists API's Proxy connection information ###

  Lists Proxy connection information of an identified API.
  When proxy connection exists, returns the Proxy backend settings information (200).
  In case no proxy connection for API in question exists, returns an error response (404).


  Parameters
  * *:id* is API id, mandatory (in URL)
  `,
// --------------------------------------------
  postProxyBackend: `
  ### Connects an API to a Proxy ###

  Adds API connection to an identified Proxy.
  On success, returns the updated API object.


  Parameters (M = mandatory)
  * *:id* is API id (in URL), (M)
  * *proxyId* is id of the Proxy, to which the API is to be connected, (M)
  * *frontendPrefix* is a unique identification for
  summarizing requests and responses done via this proxy connection, (M)
  * *backendPrefix* is an identification of API on server, (M)
  * *apiPort* is port used on API server, default value for https is 443, http is 80.
  * *disableApiKey*, [false | true], true = skip API key requirement in Proxy, default false
  * *rateLimitMode*, [unlimited | custom], default 'unlimited'

  When parameter *rateLimitMode* has value 'custom', following parameters are needed
  * *duration*, set request duration in milliseconds
  * *limitBy*, [apiKey | ip],
  * *limit*, set number of request
  * *showLimitInResponseHeaders*, [true | false], is limit shown in response headers or not
  `,
    // --------------------------------------------
  deleteProxyBackend: `
  ### Disconnects API from a Proxy ###

  Disconnects an identified API from Proxy by removing Proxy Backend.
  When proxy connection exists and it is successfully removed,
  returns an empty response (204).
  Trying to remove a non-existing proxy connection from API is considered error (404).
  `,

};

export default descriptionApis;
