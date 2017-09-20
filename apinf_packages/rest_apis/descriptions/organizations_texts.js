/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionOrganizations = {
  // --------------------------------------------
  get: `
  ### Lists and searches organizations ###

  Parameters are optional and multiple parameters can be combined.

  Example calls:

    GET /organizations

  As a response all Organizations' datas are listed.

    GET /organizations?q=apinf&limit=10

  As a response is returned up to ten first Organizations,
  which contain string "apinf" in Name, Description or URL.

  `,
  // --------------------------------------------
  post: `
  ### Adds a new Organization ###

  Admin user can add a new Organization into Catalog.

  Parameters:
  * *name* and *url* are mandatory parameters
  * *description* length must not exceed 1000 characters.

  On success, a response message with HTTP code 201 returns the created organization data.
  `,
  // --------------------------------------------
  getId: `
  ### Lists the data of an identified Organization ###

  Example call

    GET /organizations/:id

  Returns the data of the Organization specified with :id in case a match is found.

  `,
  // --------------------------------------------
  putId: `
  ### Updates an identified Organization ###

  Admin user or Organization manager can update Organization data with parameters listed below.

  Parameters
  * can be given one by one or several ones at a time
  * length of parameter *description* must not exceed 1000 characters

  `,
  // --------------------------------------------
  deleteId: `
  ### Deletes an identified Organization from catalog ###

  Admin user or Organization manager can remove Organization from Catalog.

  In successful case a response message with HTTP code 204 without any content is returned.
  Note! Trying to remove a non-existing Organization is considered a failed operation.

  `,
  // --------------------------------------------
  getIdManagers: `
  ### Lists all Managers of an identified Organization ###

  Admin user or Organization manager can identify an Organization with :id
  and get list all Organization managers'
  usernames, email addresses and IDs.

  Two lists are returned:
  * managerIds: list of all Managers' IDs
  * data: list (matching to query parameters) of Managers with contact information

  Note! The lists can differ from each other in a case when a Manager account is removed,
  but the Manager list is not updated accordingly.


  Example call:

    GET /organizations/<organization_id>/managers


  `,
  // --------------------------------------------
  postIdManagers: `
  ### Adds a new Manager into an identified Organization ###

  Admin user or Organization manager can add a new manager into organization.

  * Manager is identified with email address.
  * New manager must have a valid User account.
  * New manager must not already be a Manager in same Organization.

  On success, a complete list of Organization Managers is returned.
  `,
  // --------------------------------------------
  getIdManagersManagerid: `
  ### Lists an identified Organization's identified Manager's username and email address ###

  Admin user or Organization manager can fetch username and email address of a
  Manager identified by {managerId}.

  Example call:

    GET /organizations/<organizations id>/managers/<managers id>


  `,
  // --------------------------------------------
  deleteIdManagersManagerid: `
  ### Deletes a User from Organization Manager list ###

  Admin user or Organization manager can delete managers from Organization manager list one by one.


  Example call:

    DELETE /organizations/<organizations id>/managers/<managers id>



  Note! Trying to remove a not existing Manager is considered a failed operation.
  `,

};


export default descriptionOrganizations;
