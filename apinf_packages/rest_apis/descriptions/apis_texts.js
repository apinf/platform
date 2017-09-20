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

  Returns the API with specified ID, if a match is found.

  Example call:

      GET /apis/:id

  Result: returns the data of API identified with :id.

  `,
  // --------------------------------------------
  post: `
  ### Adds a new API to Catalog ###

  Adds an API to catalog. On success, returns the added API object.


  Parameters
  * mandatory: name and url
  * length of description must not exceed 1000 characters
  * value of lifecycleStatus must be one of example list
  * allowed values for parameter isPublic are "true" and "false"
  * if isPublic is set false, only admin or manager can see the API
  `,
  // --------------------------------------------
  put: `
  ### Updates an API ###

  Admin or API manager can update an API in catalog.
  On success, returns the updated API object.

  Parameters
  * length of description must not exceed 1000 characters
  * value of lifecycleStatus must be one of example list
  * allowed values for parameter isPublic are "true" and "false"
  * if isPublic is set false, only admin or manager can see the API

  `,
  // --------------------------------------------
  delete: `
  ### Deletes an API ###

  Admin user or API manager can delete an identified API from the Catalog,


  Example call:

    DELETE /apis/<API id>

  Result: deletes the API identified with <API id> and responds with HTTP code 204.

  `,

};


export default descriptionApis;
