/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

const getTenantEndpoint = function () {
  // Get settings document
  const settings = Settings.findOne();

  // Get url and token from settings
  const tenantUrl = _.get(settings, 'tenantIdm.endpoint');
  const tenantToken = _.get(settings, 'tenantIdm.accessToken');

  // Return URL and token, if they are set
  if (tenantUrl && tenantToken) {
    // return
    const tenant = {
      endpoint: tenantUrl,
      token: tenantToken,
    };
    return tenant;
  }
  // If not available, return false
  return false;
};

Meteor.methods({
  getTenantList () {
    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantEndpoint = getTenantEndpoint();

    console.log('1 GET tenant endpoint=', tenantEndpoint);
    if (tenantEndpoint) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantEndpoint.endpoint, Match.Maybe(String));
      console.log('2 send GET tenant request');

      try {
        const result = HTTP.get(
          tenantEndpoint.endpoint,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tenantEndpoint.tenantToken}`,
            },
          }
        );
        // Create a monitoring data
        response.tenantList = result.response;
        response.status = result.statusCode;
        console.log('3 GET a ok, result=', result);
        console.log('3 a ok, response=', response);
      } catch (err) {
        console.log('3 GET b err=', err);
        response.status = 400;
        console.log('3 b nok, response=', response);
      }
    }

    console.log('4 GET tenant response=', response);
    return response;
  },

  getUserList () {
    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantEndpoint = getTenantEndpoint();

    // NOTE! Now used tenant endpoint, perhaps needs to be configured later
    console.log('1 GET userlist endpoint=', tenantEndpoint);
    if (tenantEndpoint) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantEndpoint.endpoint, Match.Maybe(String));
      console.log('2 send GET userlist request');

      try {
        const result = HTTP.get(
          tenantEndpoint.endpoint,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tenantEndpoint.tenantToken}`,
            },
          }
        );
        // Create a monitoring data
        response.completeUserList = result.response;
        response.status = result.statusCode;
        console.log('3 GET a ok, result=', result);
        console.log('3 a ok, response=', response);
      } catch (err) {
        console.log('3 GET b err=', err);

        // For mock purposes we fill the list here ourself
        response.completeUserList = [
          {
            id: '123456789',
            name: 'Håkan',
          },
          {
            id: '223456789',
            name: 'Luis',
          },
          {
            id: '323456789',
            name: 'Pär',
          },
          {
            id: '423456789',
            name: 'Ivan',
          },
          {
            id: '523456789',
            name: 'Hans',
          },
          {
            id: '62345689',
            name: 'Pierre',
          },
          {
            id: '723456789',
            name: 'Väinämöinen',
          },
          {
            id: '82356789',
            name: 'Jack',
          },
          {
            id: '92356789',
            name: 'Umberto',
          },
        ];

        response.status = 400;

        console.log('3 b nok, response=', response);
      }
    }

    console.log('4 GET userlist response=', response);
    return response;
  },


  addTenant (tenant) {
    console.log('\nPOST tenant =\n', tenant, '\n');
    check(tenant, Object);

    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    const tenantEndpoint = getTenantEndpoint();

    console.log('1 tenant endpoint=', tenantEndpoint);
    if (tenantEndpoint) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantEndpoint.endpoint, Match.Maybe(String));
      console.log('2 send post request');

      // TODO tenant: correct parameters needed
      const userlist = [{
        'name': 'Joakim',
        'roles': ['data-provider', 'data-consumer'],
      }];
      
      try {
        const result = HTTP.post(
          tenantEndpoint.endpoint,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tenantEndpoint.tenantToken}`,
            },
            params: {
              name: tenant.name,
              description: tenant.description,
              users: userlist,
            },
          }
        );
        // Create a monitoring data
        response.status = result.statusCode;
        console.log('3 POST a ok, result=', result);
        console.log('3 a ok, response=', response);
      } catch (err) {
        console.log(+ new Date(), ' 3 POST b err=', err);
        response.status = 400;
        console.log('3 b nok, response=', response);
      }
    }

    console.log(+ new Date(), ' 4 POST response=', response);
    return response;
  },
});
