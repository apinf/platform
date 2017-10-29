/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Object with data shared by all endpoints
const common = {
  baseURL: 'localhost:3000/rest/v1',
};

// Data specific for the /organizations endpoint
const organizations = {
  endpoint: `${common.baseURL}/organizations`,
};

// User data to login/register new user
const username = 'unittestuser';
const email = 'unittestuser@test.com';
const password = 'mypassword';

// Data specific for the /organizations endpoint
const users = {
  endpoint: `${common.baseURL}/users`,
  credentials: {
    username,
    email,
    password,
  },
  nonAdminCredentials: {
    username: `regular_${username}`,
    email: `regular_${email}`,
    password: `regular_${password}`,
  },
};

// Data specific for the /organizations endpoint
const login = {
  endpoint: `${common.baseURL}/login`,
};

module.exports = {
  common,
  users,
  login,
  organizations,
};
