/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */


const request = require('superagent');
const { common, organizations } = require('../config.js');


describe('endpoints for organization module', () => {
  describe('GET - /organizations', () => {
    it('should return all organizations from the collection', done => {
      const organizationsEndpoint = `${common.baseURL}/${organizations.endpoint}`;
      request
        .get(organizationsEndpoint)
        .end((err, res) => {
          // If there was an error, stops right here and reject
          if (err) return done(err);

          // Erro variable for try/catch control
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
});
