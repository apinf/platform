/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */

const request = require('superagent');
const MongoClient = require('mongodb').MongoClient;
const { users, login } = require('./endpointConfiguration.js');

const createUser = ({ username, email, password }) => {
  return new Promise((resolve, reject) => {
    // Define new user variable
    const newUser = { username, email, password };

    // Perform request to register new user
    request
      .post(users.endpoint)
      .send(newUser)
      .end((err, res) => {
        setUserToAdmin({ username })
          .then(res => {
            return resolve({ username, password });
          })
          .catch(reject);
      });
  });
};

const performLogin = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    // Define user variable
    const user = { username, password };

    // Perform request to retrieve user credentials
    request
      .post(login.endpoint)
      .send(user)
      .end((err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
  });
};

const getUserCredentials = ({ username, email, password }) => {
  return new Promise((resolve, reject) => {
    /*
     * First login
     * If status == 200, resolve data with promise
     * If status == 401, create new username
     * Login with new user
     * Resolve data with promise
     */

    performLogin({ username, password })
      .then(res => {
        return resolve(res.body);
      })
      .catch(err => {
        createUser({ username, email, password })
          .then(res => {
            return performLogin({ username, password });
          })
          .then(res => {
            return resolve(res.body);
          })
          .catch(reject);
      });
  });
};

const hasError = ({ err, res }) => {
  // Is falsy when err is not null or status is not successful
  return err || res.status !== 201 || res.body.status !== 'success';
};

const buildCredentialHeader = ({ authToken, userId }) => {
  return {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
  };
};

const setUserToAdmin = ({ username }) => {
  return new Promise((resolve, reject) => {
    // Connect to Meteor's MongoDB
    MongoClient.connect('mongodb://localhost:3001/meteor', (err, db) => {
      // Ger Users collection
      const Users = db.collection('users');

      // Set user role to admin
      Users
        .findOne(
          { username },
          { $set: { roles: ['admin'] } }
        )
        .then(resolve)
        .catch(reject);
    });
  });
};

module.exports = {
  buildCredentialHeader,
  hasError,
  getUserCredentials,
  performLogin,
  createUser,
};
