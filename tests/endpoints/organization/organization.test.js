/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */


const request = require('superagent');
const { organizations, users } = require('../endpointConfiguration.js');
const {
  getUserCredentials,
  buildCredentialHeader,
  isArray,
  clearCollection,
  newOrganization,
} = require('../testHelper.js');

// Clear database before test runs
beforeAll(() => {
  return Promise.all([
    clearCollection('users'),
    clearCollection('Organizations'),
  ]);
});

// Clear database before test runs
afterAll(() => {
  return Promise.all([
    clearCollection('users'),
    clearCollection('Organizations'),
  ]);
});

describe('Endpoints for organization module', () => {
  describe('GET - /organizations', () => {
    it('should return all organizations from the collection', async () => {
      // Define response variable
      const { body } = await request.get(organizations.endpoint);

      // Expect to be successful and to by an empty array
      expect(body.status).toEqual('success');
      expect(isArray(body.data)).toEqual(true);
    });
  });
  describe('POST - /organizations', () => {
    it('add a new organization', async () => {
      // Set test max timeout to 10 seconds
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      // Get user credentials
      const credentials = await getUserCredentials(users.credentials);

      // Get response body
      const { body } = await request
        .post(organizations.endpoint)
        .set(buildCredentialHeader(credentials.data))
        .send(newOrganization);

      // Deconstruct status and data from response body
      const { status, data } = body;

      // Check if request was successful
      expect(status).toEqual('success');

      // Check if saved organization matches sent object
      expect(data.name).toEqual(newOrganization.name);
      expect(data.description).toEqual(newOrganization.description);
      expect(data.url).toEqual(newOrganization.url);
      expect(data.contact.person).toEqual(newOrganization.contact_name);
      expect(data.contact.phone).toEqual(newOrganization.contact_phone);
      expect(data.contact.email).toEqual(newOrganization.contact_email);
      expect(data.socialMedia.facebook).toEqual(newOrganization.facebook);
      expect(data.socialMedia.instagram).toEqual(newOrganization.instagram);
      expect(data.socialMedia.twitter).toEqual(newOrganization.twitter);
      expect(data.socialMedia.linkedIn).toEqual(newOrganization.linkedIn);
    });
    it('should return 400 because of missing name paramenter', async () => {
      // Set test max timeout to 10 seconds
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      // Get user credentials
      const credentials = await getUserCredentials(users.credentials);

      // Remove name property from new organization object
      const namelessOrganization = Object.assign({}, newOrganization);

      // delete name property
      delete namelessOrganization.name;

      try {
        await request
            .post(organizations.endpoint)
          .set(buildCredentialHeader(credentials.data))
          .send(namelessOrganization);
      } catch(error) {
        // Check if is error Object
        expect(error instanceof Error).toEqual(true);

        // Check if status is 400
        expect(error.status).toEqual(400);

        // Check if status message is fail
        expect(error.response.body.status).toEqual('fail');

        // Check if body message is expected
        expect(error.response.body.message).toEqual('Parameter "name" is erroneous or missing');
      }
    });
    it('should return 401 because of wrong authentication headers', async () => {
      // Set test max timeout to 10 seconds
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      // Get user credentials
      const credentials = await getUserCredentials(users.credentials);

      try {
        await request
          .post(organizations.endpoint)
          .send(newOrganization);
      } catch(error) {
        // Check if is error Object
        expect(error instanceof Error).toEqual(true);

        // Check if status is 400
        expect(error.status).toEqual(401);

        // Check if status message is fail
        expect(error.response.body.status).toEqual('fail');

        // Check if body message is expected
        expect(error.response.body.message).toEqual('Parameter \"name\" is erroneous or missing');
      }
    });
  });
});
