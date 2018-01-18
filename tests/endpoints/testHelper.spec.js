/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */


const { users } = require('./endpointConfiguration.js');
const {
  performLogin,
  getUserCredentials,
  buildCredentialHeader,
  createUser,
  clearCollection,
  isArray,
  newOrganization,
  generateUniqueId,
} = require('./testHelper.js');

// Clear database before test runs
beforeEach(() => {
  return Promise.all([
    clearCollection('users'),
    clearCollection('Organizations'),
  ]);
});

describe('generateUniqueId method', () => {
  it('should generate a unique Id every time', () => {
    const isDifferent = generateUniqueId() !== generateUniqueId();
    expect(isDifferent).toEqual(true);
  });
});

describe('newOrganization object', () => {
  it('should equal to expected object', () => {
    expect(newOrganization.name.split(' - ')[0]).toEqual('Organization Name');
    expect(newOrganization.description).toEqual('Description about Organization');
    expect(newOrganization.url).toEqual('https://organization.com');
    expect(newOrganization.contact_name).toEqual('David Bar');
    expect(newOrganization.contact_phone).toEqual('+7 000 000 00 00');
    expect(newOrganization.contact_email).toEqual('company-mail@gmail.com');
    expect(newOrganization.facebook).toEqual('http://url.com');
    expect(newOrganization.twitter).toEqual('http://url.com');
    expect(newOrganization.instagram).toEqual('http://url.com');
    expect(newOrganization.linkedIn).toEqual('http://url.com');
  });
});

describe('isArray method', () => {
  it('should return true for an array', () => {
    expect(isArray([])).toEqual(true);
  });
  it('should return false for object', () => {
    expect(isArray({})).toEqual(false);
  });
  it('should return false for string', () => {
    expect(isArray('string')).toEqual(false);
  });
  it('should return false for function', () => {
    expect(isArray(() => {})).toEqual(false);
  });
  it('should return false for number', () => {
    expect(isArray(0)).toEqual(false);
  });
});

describe('buildCredentialHeader method', () => {
  it('should return correct object with right property names', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    // Credential data
    const authData = {
      authToken: 'authToken',
      userId: 'userId',
    };

    // Build credential Headers from authData object
    const credentials = buildCredentialHeader(authData);

    // Test assetion logic
    expect(credentials['X-Auth-Token']).toEqual(authData.authToken);
    expect(credentials['X-User-Id']).toEqual(authData.userId);
  });
});

describe('clearCollection method', () => {
  it('should completely clear collection', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    // Clear Organizations collection
    const result = await clearCollection('Organizations');

    // Test assertion logic
    expect(result.ok).toEqual(1);
  });
});

describe('createUser Method', () => {
  it('should create new user', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    // Get body and status from user creation function
    const { body, status } = await createUser(users.credentials);

    // Test assertion logic
    expect(status).toEqual(201);
    expect(body.status).toEqual('success');
    expect(body.data.username).toEqual(users.credentials.username);
  });
});

describe('getUserCredentials method', () => {
  it('should get user credential with username and password', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    // Get user credential from login/password
    const { body, status } = await getUserCredentials(users.credentials);

    // Test assertion logic
    expect(status).toEqual(200);
    expect(body.status).toEqual('success');
  });
});

describe('performLogin method', () => {
  it('should login with existing user', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    // Make sure user is created
    await createUser(users.credentials);

    // Get username and password from user object
    const { username, password } = users.credentials;

    // Perform login with created user
    const { body, status } = await performLogin({ username, password });

    // Test assertion logic;
    expect(status).toEqual(200);
    expect(body.status).toEqual('success');
  });
});
