/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionLoginLogout = {
  // --------------------------------------------
  login: `

  ### Logging in ###

  By giving existing user account username and password you get login credentials,
  which you can use in authenticating requests.

  login response parameter value | to be filled into request header field
  :--- | :---
  auth-token-value | X-Auth-Token
  user-id-value | X-User-Id


`,
  // --------------------------------------------
  logout: `

  ### Logging out ###

  The login credentials must be filled in header of the message.

  login response parameter value | to be filled into request header field
  :--- | :---
  auth-token-value | X-Auth-Token
  user-id-value | X-User-Id

  After logout the User has to do a *new log in* in order to be able to
  make requests towards API endpoints.

`,
};

export default descriptionLoginLogout;
