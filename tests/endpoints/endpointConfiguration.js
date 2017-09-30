// Object with data shared by all endpoints
const common = {
  baseURL: `localhost:3000/rest/v1`,
};

// Data specific for the /organizations endpoint
const organizations = {
  endpoint: `${common.baseURL}/organizations`,
};

// Data specific for the /organizations endpoint
const users = {
  endpoint: `${common.baseURL}/users`,
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
