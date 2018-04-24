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
  * allowed values for parameter *isPublic* are "true" and "false"
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
  * allowed values for parameter *isPublic* are "true" and "false"
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
  getProxies: `
  ### List of available proxies ###

  Admin user can get list of available proxies.
  On success returns list of proxies detailing
  - proxy id
  - proxy name
  - proxy type.

  Example calls:

    GET /proxies

  Result: Responds with HTTP code 200 and a list of available proxies.

  If no proxies are defined, returns an empty list.
  `,
  // --------------------------------------------
  postProxy: `
  ### Connect API to a Proxy ###

  Adds to API a connection to an identified Proxy.
  On success, returns the updated API object.


  Parameters
  * *:id* is API id, mandatory (in URL)
  * *proxyId* is id of the Proxy, to which the API is to be connected, mandatory
  * *frontendPrefix* is a unique identification for
  summarizing requests and responses done via this proxy connection, mandatory
  * *backendPrefix* is an identification of API on server, mandatory
  * *apiPort* is port used on API server, default value is...
  * *disableApiKey* tells whether API key is required (false, default) not (true)
  `,

};

export default descriptionApis;
