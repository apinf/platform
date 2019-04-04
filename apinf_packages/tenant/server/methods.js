/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { TAPi18n } from 'meteor/tap:i18n';
import { Email } from 'meteor/email';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

// Global array of users.
// It is filled while fetching complete user list
// and used when user email address is needed for notification
let completeUserList = [];

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

function compare (a, b) {
  if (a.username < b.username) return -1;
  if (a.username > b.username) return 1;
  return 0;
}

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
        // deserialize JSON
        const tenantList = JSON.parse(result.content);

        response.tenantList = tenantList;

        // Modify parameters according to tenant manager API from object to array
        response.tenantList = tenantList.map(tenant => {
          // console.log('tenant=', tenant);
          const convertedUserList = tenant.users.map(user => {
            // Return converted user list
            return {
              id: user.id,
              name: user.name,
              provider: user.roles.includes('data-provider') ? 'checked' : false,
              consumer: user.roles.includes('data-consumer') ? 'checked' : false,
            };
          });

          // Return tenant, pick necessary fields for internal use
          return {
            id: tenant.id,
            owner_id: tenant.owner_id,
            name: tenant.name,
            description: tenant.description,
            users: convertedUserList,
          };
        });

        response.status = result.statusCode;
      } catch (err) {
        // Return error object
        let errorMessage = TAPi18n.__('tenantRequest_missingTenantList');
        errorMessage = errorMessage.concat(err);
        throw new Meteor.Error(errorMessage);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }

    // console.log('4 GET tenant response=', response);
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
      // Add endpoint to base path
      tenantUrl = tenantUrl.concat('user');

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
        // deserialize JSON gotten from manager
        const resultFromTenantManager = JSON.parse(result.content);
        // We need only id and username, so pick them
        completeUserList = resultFromTenantManager.users.map(user => {
          return {
            id: user.id,
            username: user.username,
            enabled: user.enabled,
            email: user.email,
          };
        });

        // Sort list to ascending order
        completeUserList.sort(compare);
        // prepare response
        response.completeUserList = completeUserList;
        response.status = result.statusCode;
      } catch (err) {
        // Return error object
        let errorMessage = TAPi18n.__('tenantRequest_missingUserlist');
        errorMessage = errorMessage.concat(err);
        throw new Meteor.Error(errorMessage);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }
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
      // Add endpoint to base path
      tenantUrl = tenantUrl.concat('tenant');

      // Get user's tenant access token
      const accessToken = getTenantToken();

      // Convert parameters to array in tenant manager API from internal object
      const userlist = tenant.users.map(user => {
        const tenantRoles = [];
        if (user.provider) {
          tenantRoles.push('data-provider');
        }
        if (user.consumer) {
          tenantRoles.push('data-consumer');
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

      console.log('\n ----------------- Add tenant ---------------------\n');
      console.log('add tenant userlist=\n', JSON.stringify(tenantToSend, null, 2));

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
      } catch (err) {
        // Return error object
        throw new Meteor.Error(err.message);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }
    return response;
  },

  deleteTenant (tenant) {
    check(tenant, Object);

    const response = {};

    // Fetch tenant endpoint and token
    let tenantUrl = getTenantInfo();

    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      // Add endpoint to base path
      tenantUrl = tenantUrl.concat('tenant/');
      tenantUrl = tenantUrl.concat(tenant.id);
      tenantUrl = tenantUrl.concat('/');

      // Get user's tenant access token
      const accessToken = getTenantToken();

      try {
        const result = HTTP.del(
          tenantUrl,
          {
            headers: {
            //  'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Create a monitoring data
        response.status = result.statusCode;
      } catch (err) {
        response.status = err.response.statusCode;
        response.content = err.response.content;

        // Return error object
        throw new Meteor.Error(err.message);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }
    return response;
  },

  updateTenant (tenantPayload) {
    check(tenantPayload, Object);

    const response = {};

    // Fetch tenant endpoint and token
    let tenantUrl = getTenantInfo();

    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      // Add endpoint to base path
      tenantUrl = tenantUrl.concat('tenant/');
      tenantUrl = tenantUrl.concat(tenantPayload.id);

      // Get user's tenant access token
      const accessToken = getTenantToken();

       // Serialize to JSON
      const payLoadToSend = JSON.stringify(tenantPayload.body);

      try {
        const result = HTTP.patch(
          tenantUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            content: payLoadToSend,
          }
        );
        // Create a monitoring data
        response.status = result.statusCode;
      } catch (err) {
        response.status = err.response.statusCode;
        response.content = err.response.content;

        // Return error object
        throw new Meteor.Error(err.message);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }
    return response;
  },
  checkTenantUsers (userCheckData) {
    check(userCheckData, Object);

    const response = {};
    // If no changes in user, return here always OK
    if (userCheckData.type !== 'user') {
      response.status = 200;
      return response;
    }

    // Fetch tenant endpoint and token
    let tenantUrl = getTenantInfo();

    if (tenantUrl) {
      // Make sure endPoint is a String
      // eslint-disable-next-line new-cap
      check(tenantUrl, Match.Maybe(String));
      // Add endpoint to base path
      tenantUrl = tenantUrl.concat('tenant/');
      tenantUrl = tenantUrl.concat(userCheckData.id);

      // Get user's tenant access token
      const accessToken = getTenantToken();

       // Serialize to JSON
      const payLoadToSend = JSON.stringify(userCheckData.body);

      try {
        const result = HTTP.patch(
          tenantUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            content: payLoadToSend,
          }
        );
        // Only 200 is acceptable status code
        if (result.statusCode === 200) {
          response.status = result.statusCode;
        } else {
          // Return error object
          let errMsg = 'Error in user, refresh tenants and try again! ';
          errMsg = errMsg.concat(result);
          throw new Meteor.Error(errMsg);
        }
      } catch (err) {
        response.status = err.response.statusCode;
        response.content = err.response.content;

        // Return error object
        throw new Meteor.Error(err.message);
      }
    } else {
      // Return error object
      const errorMessage = TAPi18n.__('tenantRequest_missingBasepath');
      throw new Meteor.Error(errorMessage);
    }
    return response;
  },
  informTenantUser (userlist, notificationType, tenantName) {
    check(userlist, Array);
    check(notificationType, String);
    check(tenantName, String);

    let emailText;
    let emailSubject;
    // To convey variables to text strings
    const params = { tenant: tenantName };

    // Check the type of notification
    if (notificationType === 'userRoleChange') {
      emailSubject = TAPi18n.__('informTenantUser_emailSubject_userRoleChange', params);
      emailText = TAPi18n.__('informTenantUser_emailText_userRoleChange', params);
    } else if (notificationType === 'userRemoval') {
      emailSubject = TAPi18n.__('informTenantUser_emailSubject_userRemoval', params);
      emailText = TAPi18n.__('informTenantUser_emailText_userRemoval', params);
    } else if (notificationType === 'tenantRemoval') {
      emailSubject = TAPi18n.__('informTenantUser_emailSubject_tenantRemoval', params);
      emailText = TAPi18n.__('informTenantUser_emailText_tenantRemoval', params);
    } else if (notificationType === 'tenantAddition') {
      emailSubject = TAPi18n.__('informTenantUser_emailSubject_tenantAddition', params);
      // Note! Same text as in user role change
      emailText = TAPi18n.__('informTenantUser_emailText_userRoleChange', params);
    }

    // Send notification for each user in list
    if (emailText) {
      // Get settings
      const settings = Settings.findOne();

      // Email can be sent only when email settings are configured
      if (settings.mail && settings.mail.enabled) {
        // Send email for each changed user
        userlist.forEach(user => {
          // Get the email address for user in question
          // eslint-disable-next-line
          const toUser = completeUserList.find(userData => userData.id === user.id);

          // Add user name to notification
          let emailTextToSend = emailText.concat(user.name);

          // In case roles were changed, anticipate new roles.
          // Consumer as default, provider, if indicated.
          if (notificationType === 'userRoleChange' || notificationType === 'tenantAddition') {
            emailTextToSend = emailTextToSend.concat('. ');
            emailTextToSend =
              emailTextToSend.concat(TAPi18n.__('informTenantUser_emailText_roleInfo'));
            emailTextToSend = emailTextToSend.concat(' data-consumer');
            if (user.provider) {
              emailTextToSend = emailTextToSend.concat(', data-provider.');
            }
          }

          // Fill data to be sent
          const emailContent = {
            to: toUser.email,
            from: settings.mail.fromEmail,
            subject: emailSubject,
            text: emailTextToSend,
          };

          // Send the e-mail
          Email.send(emailContent);
        });
      }
    }
  },
});
