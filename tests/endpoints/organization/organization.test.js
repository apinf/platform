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
  hasError,
  clearCollection,
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
    it('should return all organizations from the collection', done => {
      // Initiate test request
      request
        .get(organizations.endpoint)
        .end((err, res) => {
          // If there was an error, stops right here and reject
          if (err) return hasError({ err, res });

          // Error variable for try/catch control
          let error = null;

          // Try/Catch statement throws error
          try {
            // Expects to be function. If not, throws error
            expect(res.body.title).toEqual('success');
            expect(res.body.data).arrayContaining([]);
          } catch (e) {
            // Catchs thrown error and sets it to error variable
            error = e;
          }

          // Test done
          return done(error);
        });
    });
  });
  describe('POST - /organizations', () => {
    it('add a new organization', done => {
      // Set test max timeout to 10 seconds
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      // Simple ID generation for uniquess of test
      const uniqueTimeStamp = new Date().getTime();

      // New organization data, as in the swagger example
      const newOrganization = {
        name: `Organization Name - ${uniqueTimeStamp}`,
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

      // Get user credentrials
      getUserCredentials(users.credentials)
        .then(credentials => {
          // Initiate test request
          request
            .post(organizations.endpoint)
            .set(buildCredentialHeader(credentials.data))
            .send(newOrganization)
            .end((err, res) => {
              if (err) return done(!hasError({ err, res }));

              // Error variable for try/catch control
              let error = null;

              // Try/Catch statement throws error
              try {
                // Expects to be function. If not, throws error
                expect(res.body.status).toEqual('success');
              } catch (e) {
                // Catchs thrown error and sets it to error variable
                error = e;
              }

              // Test done
              return done(error);
            });
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
