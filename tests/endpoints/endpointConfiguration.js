// Object with data shared by all endpoints
const common = {
  baseURL: `localhost:3000/rest/v1`,
};

// Data specific for the /organizations endpoint
const organizations = {
  endpoint: `${common.baseURL}/organizations`,
};

// User data to login/register new user
const username = 'unittestuser'
const email = 'unittestuser@test.com'
const password = 'mypassword'

// Data specific for the /organizations endpoint
const users = {
  endpoint: `${common.baseURL}/users`,
  credentials: {
    username,
    email,
    password
  }
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
