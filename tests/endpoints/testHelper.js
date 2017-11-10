/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const request = require('superagent');
const MongoClient = require('mongodb').MongoClient;
const { users, login } = require('./endpointConfiguration.js');

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const createUser = async ({ username, email, password, regular = false }) => {
  // Define new user variable
  const newUser = { username, email, password };

  // Clear users collection
  const clearCollectionResponse = await clearCollection('users');

  // Add new user
  const { body, status } = await request.post(users.endpoint).send(newUser);

  if (!regular) {
    await setUserToAdmin({ username });
  }

  return { body, status };
};

const performLogin = async ({ username, password }) => {
  // Define user variable
  const user = { username, password };

  // Perform login
  const { status, body } = await request.post(login.endpoint).send(user);

  return { status, body };
};

const getUserCredentials = async ({ username, email, password, regular = false }) => {
  // Get uniqueID
  const uniqueID = generateUniqueId();

  username = `${uniqueID}${username}`;
  email = `${uniqueID}${email}`;

  // Create user
  const userResponse = await createUser({ username, email, password, regular });

  // Perform Login. Needs to be executed after user is created
  const loginResult = await performLogin({ username, password });

  // Resolve with login response
  return loginResult;
};

const buildCredentialHeader = ({ authToken, userId }) => {
  return {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
  };
};

const setUserToAdmin = async ({ username }) => {
  // Connect to Meteor's MongoDB
  const db = await MongoClient.connect('mongodb://localhost:3001/meteor');

  // Get users collection reference
  const Users = db.collection('users');

  // Define findOneAndUpdate arguments
  const query = { username };
  const updateOptions = { $set: { roles: ['admin'] } };

  // Set user role to admin
  const newAdminResult = await Users.findOneAndUpdate(query, updateOptions);

  // Resolve with found object
  return newAdminResult;
};

const clearCollection = async (collection) => {
  // Get mongoDb connection
  const db = await MongoClient.connect('mongodb://localhost:3001/meteor');

  // Clear entire collection
  const { result } = await db.collection(collection).remove({});

  // Resolve with result
  return result;
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
  getUserCredentials,
  performLogin,
  createUser,
  clearCollection,
  isArray,
  newOrganization,
  generateUniqueId,
};
