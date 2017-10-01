const request = require('superagent');
const { common, users, login } = require('./endpointConfiguration.js');

module.exports.createUser = ({ username, email, password }) =>
  new Promise((resolve, reject) => {
    // Define new user variable
    const newUser = { username, email, password }

    // Perform request to register new user
    request
      .post(users.endpoint)
      .send(newUser)
      .end((err, res) => err? reject(err) : resolve(res));
  });


module.exports.performLogin = ({ username, password }) =>
  new Promise((resolve, reject) => {
    // Define user variable
    const user = { username, password }

    // Perform request to retrieve user credentials
    request
      .post(login.endpoint)
      .send(user)
      .end((err, res) => err? reject(err) : resolve(res));
  });


module.exports.getUserCredentials = ({ username, email, password }) =>
  new Promise((resolve, reject) => {
    /*
     * First login
     * If status == 200, resolve data with promise
     * If status == 401, create new username
     * Login with new user
     * Resolve data with promise
     */
    performLogin({ username, password })
      .then(resolve)
      .catch(err => {
        createUser({ username, email, password })
        .then(res => performLogin({ username, password }))
        .then(resolve)
        .catch(reject)
      })
  });
