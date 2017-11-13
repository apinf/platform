/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */


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
beforeEach(() => {
  return Promise.all([

    clearCollection('Organizations'),
  ]);
});

// Clear database before test runs
afterAll(() => {
  return Promise.all([
    clearCollection('Organizations'),
  ]);
});

describe('Endpoints for organization module', () => {
  describe('GET', () => {
    describe('/organizations - List and search organizations', () => {
      it('should return all organizations from the collection', async () => {
        // Define response variable
        const { body } = await request.get(organizations.endpoint);

        // Expect to be successful and to by an empty array
        expect(body.status).toEqual('success');
        expect(isArray(body.data)).toEqual(true);
      });

      it('should return 400 because of erroneous parameter', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Set erroneous params
        const queryParams = { skip: 'He was 40' };

        try {
          // Define response variable
          await request
            .get(organizations.endpoint)
            .query(queryParams);
        } catch (getOrganizationError) {
          // Deconstruct error object
          const { response, status } = getOrganizationError;

          // Test assertion logic
          expect(getOrganizationError instanceof Error).toEqual(true);
          expect(status).toEqual(400);
          expect(response.body.status).toEqual('fail');
          expect(response.body.message).toEqual('Bad Request. Erroneous or missing parameter.');
        }
      });
    });

    describe('/organizations/{id} - Fetch Organization with specified ID', () => {
      it('return organization by id', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const credentials = await getUserCredentials(users.credentials);

        // Get response body from inserting organization
        const insertedOrganization = await request
          .post(organizations.endpoint)
          .set(buildCredentialHeader(credentials.body.data))
          .send(newOrganization);

        // Deconstruct _id from organization
        const { _id } = insertedOrganization.body.data;

        // Define response variable
        const { body } = await request.get(`${organizations.endpoint}/${_id}`);

        // Expect to be successful and to by an empty array
        expect(body.data.name).toEqual(newOrganization.name);
        expect(body.data.description).toEqual(newOrganization.description);
        expect(body.data.url).toEqual(newOrganization.url);
        expect(body.data.contact.person).toEqual(newOrganization.contact_name);
        expect(body.data.contact.phone).toEqual(newOrganization.contact_phone);
        expect(body.data.contact.email).toEqual(newOrganization.contact_email);
        expect(body.data.socialMedia.facebook).toEqual(newOrganization.facebook);
        expect(body.data.socialMedia.instagram).toEqual(newOrganization.instagram);
        expect(body.data.socialMedia.twitter).toEqual(newOrganization.twitter);
        expect(body.data.socialMedia.linkedIn).toEqual(newOrganization.linkedIn);
      });

      it('should return 404 because of organization was not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Define response variable
        try {
          await request.get(`${organizations.endpoint}/invalidId`);
        } catch (invalidIdError) {
          // Deconstruct status and response from error
          const { status, response } = invalidIdError;

          // Test assertion logic
          expect(invalidIdError instanceof Error).toEqual(true);
          expect(status).toEqual(404);
          expect(response.body.status).toEqual('fail');
          expect(response.body.message).toEqual('Organization with specified ID (invalidId) is not found');
        }
      });
    });

    describe('/organizations/{id}/managers - Get Organization Manager list', () => {
      it('should return 200 with List of organization’s managers', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const credentials = await getUserCredentials(users.credentials);

        // Get response body from inserting organization
        const insertedOrganization = await request
          .post(organizations.endpoint)
          .set(buildCredentialHeader(credentials.body.data))
          .send(newOrganization);

        // Deconstruct _id from organization
        const { _id, managerIds } = insertedOrganization.body.data;

        // Define response variable
        const { body, status } = await request
          .get(`${organizations.endpoint}/${_id}/managers`)
          .set(buildCredentialHeader(credentials.body.data));

        // Test assertion logic
        expect(status).toEqual(200);
        expect(body.managerIds).toEqual(expect.arrayContaining(managerIds));
        expect(body.data[0]._id).toEqual(credentials.body.data.userId);
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        try {
          await request.get(`${organizations.endpoint}/noId/managers`);
        } catch (authenticationError) {
          // Deconstruct error object
          const { status, response } = authenticationError;

          // Test assertion logic
          expect(authenticationError instanceof Error).toEqual(true);
          expect(status).toEqual(401);
          expect(response.body.status).toEqual('error');
          expect(response.body.message).toEqual('You must be logged in to do this.');
        }
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Build regular user OBJECT
        const regularUser = Object.assign({}, users.credentials, { regular: true });

        // Get adminUser credentials
        const adminCredentials = await getUserCredentials(users.credentials);

        // Get response body
        const insertedOrganization = await request
          .post(organizations.endpoint)
          .set(buildCredentialHeader(adminCredentials.body.data))
          .send(newOrganization);

        // Get regular credentials.
        // Has to be called after the insertion because this clears users Collection
        const regularCredentials = await getUserCredentials(regularUser);

        // Deconstruct _id from organization
        const { _id } = insertedOrganization.body.data;

        // Define response variable
        try {
          await request
          .get(`${organizations.endpoint}/${_id}/managers`)
          .set(buildCredentialHeader(regularCredentials.body.data));
        } catch (authorizationError) {
          // Deconstruct error object
          const { status, response } = authorizationError;

          // Test assertion logic
          expect(authorizationError instanceof Error).toEqual(true);
          expect(status).toEqual(403);
          expect(response.body.status).toEqual('fail');
          expect(response.body.message).toEqual('You do not have permission for editing this Organization');
        }
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const credentials = await getUserCredentials(users.credentials);

        try {
          await request
            .get(`${organizations.endpoint}/noId/managers`)
            .set(buildCredentialHeader(credentials.body.data));
        } catch (authenticationError) {
          // Deconstruct error object
          const { status, response } = authenticationError;

          // Test assertion logic
          expect(authenticationError instanceof Error).toEqual(true);
          expect(status).toEqual(404);
          expect(response.body.status).toEqual('fail');
          expect(response.body.message).toEqual('Organization with specified ID (noId) is not found');
        }
      });
    });

    describe('/organizations/{id}/managers/{id} - Get Organization Manager username and email address.', () => {
      it('should return 200 with organization manager contact information.', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "data": {
              "_id": "user-id-value",
              "username": "myusername",
              "emails": [
                {
                  "address": "john.doe@ispname.com",
                  "verified": "false"
                }
              ]
            }
          }
        */
      });

      it('should return 400 because of erroneous parameter', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
        EXPECTED Object sample
          {
            "status": "fail",
            "message": "Organization ID was not provided"
          }
        */
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "status": "fail",
            "message": "Organization with specified ID is not found"
          }
        */
      });
    });
  });

  describe('POST', () => {
    describe('/organizations - Add new organization', () => {
      it('add a new organization', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const credentials = await getUserCredentials(users.credentials);

        // Get response body
        const { body } = await request
          .post(organizations.endpoint)
          .set(buildCredentialHeader(credentials.body.data))
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
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const { body } = await getUserCredentials(users.credentials);

        // Remove name property from new organization object
        const namelessOrganization = Object.assign({}, newOrganization);

        // delete name property
        delete namelessOrganization.name;

        try {
          await request
            .post(organizations.endpoint)
            .set(buildCredentialHeader(body.data))
            .send(namelessOrganization);
        } catch (error) {
          // Deconstruct status and response from error
          const { status, response } = error;

          // Test assertion logic
          expect(error instanceof Error).toEqual(true);
          expect(status).toEqual(400);
          expect(response.body.status).toEqual('fail');
          expect(response.body.message).toEqual('Parameter "name" is erroneous or missing');
        }
      });

      it('should return 401 because of wrong authentication headers', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Get user credentials
        const { body } = await getUserCredentials(users.credentials);

        // Wrong authentication hearders
        const headers = buildCredentialHeader(body.data);
        headers['X-Auth-Token'] += 'wrong';

        try {
          await request
            .post(organizations.endpoint)
            .set(headers)
            .send(newOrganization);
        } catch (error) {
          // Deconstruct status and response from error
          const { status, response } = error;

          // Test assertion logic
          expect(error instanceof Error).toEqual(true);
          expect(status).toEqual(401);
          expect(response.body.status).toEqual('error');
          expect(response.body.message).toEqual('You must be logged in to do this.');
        }
      });

      it('should return 403 because of unauthoreized user', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        // Flag to ser user to regular
        const regularFlag = { regular: true };

        // Assign object property
        const credentialParams = Object.assign({}, users.credentials, regularFlag);

        // Get user credentials
        const { body } = await getUserCredentials(credentialParams);

        try {
          await request
            .post(organizations.endpoint)
            .set(buildCredentialHeader(body.data))
            .send(newOrganization);
        } catch (error) {
          // Deconstruct status and response from error
          const { status, response } = error;

          // Test assertion logic
          expect(error instanceof Error).toEqual(true);
          expect(status).toEqual(403);
          expect(response.body.status).toEqual('error');
          expect(response.body.message).toEqual('You do not have permission to do this.');
        }
      });
    });

    describe('/organizations/{id}/managers - Add new manager to organization', () => {
      it('should return 200 because organization Manager added successfully', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "status": "success",
            "managerIds": [
              "user-id-value"
            ],
            "data": {
              "_id": "user-id-value",
              "username": "myusername",
              "emails": [
                {
                  "address": "john.doe@ispname.com",
                  "verified": "false"
                }
              ]
            }
          }
        */
      });

      it('should return 400 because erroneous or missing parameter.', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "status": "fail",
            "message": "New Manager's email address is missing"
          }
        */
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "status": "fail",
            "message": "Organization with specified ID is not found"
          }
        */
      });
    });
  });

  describe('PUT', () => {
    describe('/organizations/{id} - Update organization', () => {
      it('return organization by id', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 400 because of erroneous parameter', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED OBJECT
          {
            "status": "fail",
            "message": "Parameter \"description\" is erroneous or too long"
          }
        */
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });
    });
  });

  describe('DELETE', () => {
    describe('/organizations/{id} - Delete identified Organization from catalog', () => {
      it('should return 204 because organization removed successfully', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });
    });

    describe('/organizations/{id}/managers/{id} - Delete identified Manager from Organization Manager list', () => {
      it('should return 200 because organization Manager removed successfully', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "data": {
              "_id": "user-id-value",
              "username": "myusername",
              "emails": [
                {
                  "address": "john.doe@ispname.com",
                  "verified": "false"
                }
              ]
            }
          }
        */
      });

      it('should return 400 because of erroneous parameter', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
        EXPECTED Object sample
          {
            "status": "fail",
            "message": "Organization ID was not provided"
          }
        */
      });

      it('should return 401 because authentication is required', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 403 because user does not have permission', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
      });

      it('should return 404 because organization is not found', async () => {
        // Set test max timeout to 10 seconds
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        throw new Error();
        /*
          EXPECTED Object sample
          {
            "status": "fail",
            "message": "Organization with specified ID is not found"
          }
        */
      });
    });
  });
});
