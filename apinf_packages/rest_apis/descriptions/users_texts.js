/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionUsers = {
  // --------------------------------------------
  get: `
  ### Searches and lists Users ###

  With this method an Admin user can list Users (has access to all Users data)
  or a non-Admin user can list own data.

  With query parameters Users can be filtered and the number and order of
  returned list can be managed.

  Sort criteria are following:
  * by user's name: *username*
  * by user account creation dates: *created_at*
  * by organization name: *organization*

  Parameters are optional and can be combined. Default value is to sort by ascending by username.

  Example call:

    GET /users?q=apinf&organization_id=<org_id>

  Returns Users, who have string "apinf" either in username, company or email address
  AND who belong to Organization identified with <org_id>.


  `,
  // --------------------------------------------
  post: `
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
  getId: `
  ### Lists Users with UserID ###

  With this method an Admin user can list data of a any User identified with ID.
  Also a non-Admin user can list own data.

  Example call:

    GET /users/<user-id>

  Returns data of user identified with users-id, in case a match is found.


  `,
  // --------------------------------------------
  deleteId: `
  ### Removes the identified User ###

  With this method an Admin user can remove user accounts. Also a non-Admin user
  can remove own user account.

  Example call:

    DELETE /users/<users-id>

  Removes the user identified with users-id and responses with HTTP code 204 without content.


  `,
  // --------------------------------------------
  putId: `
  ### Updates data of a User identified by user ID ###

  With this method a user can edit own account.

  Parameters:
  * At least one parameter must be given.
  * *Username* must be unique.
  * *Password* must be at least 6 characters.


  Note! Users needs a new login after password change in order to get new valid credentials.

  `,
  // --------------------------------------------
  getUpdates: `
  ### Returns users based on addition date ###

  Parameters are optional and they can be combined.

  Example call:

    GET /users/updates?since=7&organization_id=<org-id>

  As a response is returned an array containing Users, which have been created within
  last seven days and who are managers in Organization identified with org-id.

  `,


};


export default descriptionUsers;
