/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/apinf_packages/settings/collection';


const getTenantToken = function () {
  // Get user
  const userId = Meteor.userId();
  const user = Meteor.users.findOne(userId);

  let tenantToken;
  if (user && user.services && user.services.fiware) {
    tenantToken = user.services.fiware.accessToken;
  }
  return tenantToken;
};


const getTenantInfo = function () {
  // Get settings document
  const settings = Settings.findOne();

  // Get url and token from settings
  const tenantUrl = _.get(settings, 'tenantIdm.basepath');

  // Return URL and token, if they are set
  if (tenantUrl) {
    return tenantUrl;
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
    let tenantUrl = getTenantInfo();

    console.log('\n ------------ Fetch Tenant list -------------- \n');
    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      tenantUrl = tenantUrl.concat('tenant');
      console.log(+new Date(), ' 2 send GET tenant request to = ', tenantUrl);

      // Get user's tenant access token
      const accessToken = getTenantToken();

      try {
        const result = HTTP.get(
          tenantUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Create a monitoring data

        console.log('3 tenant GET a ok, result=', result);

        // deserialize JSON
        const tenantList = JSON.parse(result.content);

        response.tenantList = tenantList;
        response.status = result.statusCode;
        console.log('3 tenant a ok, response=', response);
      } catch (err) {
        console.log('3 tenant b nok, err=\n', err);
        console.log('err result=', result);
        
        response.tenantList = [
          {
            id: 1123456789,
            owner_id: 1987654321,
            tenant_organization: '1111',
            name: 'First tenant',
            description: 'This is a first class tenant',
            users: [
              {
                id: '123qwe', 
                name: 'Spede',
                provider: false,
                customer: 'data-customer',
              },
              {
                id: '223qwe',
                name: 'Simo',
                provider: 'data-provider',
                customer: false,
              },
              {
                id: '323qwe',
                name: 'Vesku',
                provider: 'data-provider',
                customer: 'data-customer',
              },
            ],
          },
          {
            id: 2123456789,
            owner_id: 2987654321,
            tenant_organization: '1111',
            name: 'Second tenant',
            description: 'This is a second class tenant',
            users: [
              {
                id: '423qwe',
                name: 'Tupu',
                provider: 'data-provider',
                customer: false,
              },
              {
                id: '523qwe',
                name: 'Hupu',
                provider: 'data-provider',
                customer: 'data-customer',
              },
              {
                id: '623qwe',
                name: 'Lupu',
                provider: false,
                customer: 'data-customer',
              },
              {
                id: '723qwe',
                name: 'Skrupu',
                provider: false,
                customer: 'data-customer',
              },
            ],
          },
          {
            id: 3123456789,
            owner_id: 31987654321,
            tenant_organization: '1111',
            description: 'This is a third class tenant',
            name: 'Third tenant',
            users: [
              {
                id: 'a123qwe',
                name: 'Ismo',
                provider: 'data-provider',
                customer: false,
              },
              {
                id: 'b123qwe',
                name: 'Asmo',
                provider: 'data-provider',
                customer: 'data-customer',
              },
              {
                id: 'c123qwe',
                name: 'Osmo',
                provider: false,
                customer: 'data-customer',
              },
              {
                id: 'd123qwe',
                name: 'Atso',
                provider: 'data-provider',
                customer: 'data-customer',
              },
              {
                id: 'e123qwe',
                name: 'Matso',
                provider: false,
                customer: 'data-customer',
              },
            ],
          },
        ];
        
        console.log('3 b tenant nok, artificial response=', response);
      }
    }
    
    console.log('4 GET tenant response=', response);
    return response;
  },
 
  getTenantUserList () {
    const response = {};
    // In case of failure
    response.status = 400;

    // Fetch tenant endpoint and token
    let tenantUrl = getTenantInfo();

    console.log('\n ------------ Fetch User list -------------- \n');
    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      tenantUrl = tenantUrl.concat('user');
      console.log(+new Date(), ' 1 send GET userlist request to=\n', tenantUrl);

      // Get user's tenant access token
      const accessToken = getTenantToken(); 

      try {
        const result = HTTP.get(
          tenantUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // console.log('2 user GET a ok, result=\n', result);

        // deserialize JSON from manager
        const resultFromTenantManager = JSON.parse(result.content);
        // We need only id and username, so pick them
        const completeUserList = resultFromTenantManager.users.map(user => {
          return {
            id: user.id,
            username: user.username,
          };
        });

        // prepare response
        response.completeUserList = completeUserList;
        response.status = result.statusCode;

      } catch (err) {
        console.log('3 user GET b err=\n', err);
        console.log('err resp=', err.response.statusCode);

        response.status = err.response.statusCode;
        response.content = err.response.content;

        // For mock purposes we fill the list here ourself
        response.completeUserList = [
          {
            id: '123456789',
            username: 'Håkan',
          },
          {
            id: '223456789',
            username: 'Luis',
          },
          {
            id: '323456789',
            username: 'Pär',
          },
          {
            id: '423456789',
            username: 'Ivan',
          },
          {
            id: '523456789',
            username: 'Hans',
          },
          {
            id: '62345689',
            username: 'Pierre',
          },
          {
            id: '723456789',
            username: 'Väinämöinen',
          },
          {
            id: '82356789',
            username: 'Jack',
          },
          {
            id: '92356789',
            username: 'Umberto',
          },
        ];
      }
    }

    console.log('4 GET userlist response=', response);
    return response;

  },


  addTenant (tenant) {
    check(tenant, Object);

    const response = {};

    // Fetch tenant endpoint and token
    let tenantUrl = getTenantInfo();

    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      tenantUrl = tenantUrl.concat('tenant');

      // Get user's tenant access token
      const accessToken = getTenantToken(); 

      // Modify parameters according to tenant manager API from object to array
      const userlist = tenant.users.map(user => {
        const tenantRoles = [];
        if (user.provider) {
          tenantRoles.push('data-provider');
        }
        if (user.customer) {
          tenantRoles.push('data-customer');
        }
        return {
          id: user.id,
          name: user.name,
          roles: tenantRoles,
        };
      });

      // New tenant object to be sent
      const tenantToSend = {
        name: tenant.name,
        description: tenant.description,
        users: userlist,
      };

      // Serialize to JSON
      const tenantJSON = JSON.stringify(tenantToSend);

      console.log('add tenant userlist=\n', tenantJSON);

      try {
        const result = HTTP.post(
          tenantUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            content: tenantJSON,
          }
        );
        // Create a monitoring data
        response.status = result.statusCode;
        console.log('3 POST a ok, result=', result);
        console.log('3 a ok, response=', response);
      } catch (err) {
        console.log(+ new Date(), ' 3 POST b err=', err);
        response.status = result.statusCode;
        console.log('3 b nok, response=', response);
      }
    }

    console.log(+ new Date(), ' 4 POST response=', response);
    return response;
  },
});
