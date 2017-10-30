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

const createUser = ({ username, email, password, isRegular = false }) => {
  return new Promise(async (resolve, reject) => {
    // Define new user variable
    const newUser = { username, email, password };

    // Perform request to register new user
    try {
      // Clear users collection
      const clearCollectionResponse = await clearCollection('users')

      // Add new user
      const newUserResponse = await request.post(users.endpoint).send(newUser)

      if (!isRegular) {
        await setUserToAdmin({ username })
      }

      resolve(newUserResponse)
    } catch (error) {
      reject(error)
    }
  });
};

const performLogin = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    // Define user variable
    const user = { username, password };

    try {
      // Perform login
      const loginResult = await request.post(login.endpoint).send(user)

      resolve(loginResult)
    } catch(error) {
      reject(error)
    }
  });
};

const getUserCredentials = ({ username, email, password, regular = false }) => {
  return new Promise(async (resolve, reject) => {
    /*
     * First login
     * If status == 200, resolve data with promise
     * If status == 401, create new username
     * Login with new user
     * Resolve data with promise
     */
     resolve({})
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
  return new Promise(async (resolve, reject) => {
    try {
      // Connect to Meteor's MongoDB
      const db = await MongoClient.connect('mongodb://localhost:3001/meteor');

      // Get users collection reference
      const Users = db.collection('users');

      // Define findOneAndUpdate arguments
      const query = { username };
      const updateOptions = { $set: { roles: ['admin'] } }

      // Set user role to admin
      const newAdminResult = await Users.findOneAndUpdate(query, updateOptions)

      resolve(newAdminResult)
    } catch (error) {
      reject(error)
    }
  })
};

const clearCollection = (collection) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get mongoDb connection
      const db = await MongoClient.connect('mongodb://localhost:3001/meteor');

      // Get mongoDb connection
      const Users = db.collection('users');

      // Clear entire collection
      const { result } = await Users.remove({});

      // Resolve with result
      resolve(result);
    } catch (mongoError) {
      reject(mongoError);
    }
  });
};

const isArray = item => {
  return Array.isArray(item);
};

// New organization data, as in the swagger example
const newOrganization = {
  name: `Organization Name - ${new Date().getTime()}`,
  description: 'Description about Organization',
  url: 'https://organization.com',
  contact_name: 'David Bar',
  contact_phone: '+7 000 000 00 00',
  contact_email: 'company-mail@gmail.com',
  facebook: 'http://url.com',
  twitter: 'http://url.com',
  instagram: 'http://url.com',
  linkedIn: 'http://url.com',
};

module.exports = {
  buildCredentialHeader,
  hasError,
  getUserCredentials,
  performLogin,
  createUser,
  clearCollection,
  isArray,
  newOrganization,
};
