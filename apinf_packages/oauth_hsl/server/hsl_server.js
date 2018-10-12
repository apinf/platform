/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// Meteor contributed packages imports
import { ServiceConfiguration } from 'meteor/service-configuration';

// Npm packages imports
import _ from 'lodash';

Hsl = {};

OAuth.registerService('hsl', 2, null, function (query) {

  const debug = false;
  const token = getToken(query);
  if (debug) console.log('XXX: register token:', token);

  const accessToken = token.access_token || token.id_token;
  const expiresAt = (+new Date) + (1000 * parseInt(token.expires_in, 10));

  const userinfo = getUserInfo(accessToken);
  if (debug) console.log('XXX: userinfo:', userinfo);

  const serviceData = {};
  serviceData.id = userinfo.sub;
  serviceData.username = userinfo.preferred_username;
  serviceData.fullname = userinfo.name;
  serviceData.accessToken = userinfo.accessToken;
  serviceData.expiresAt = expiresAt;
  serviceData.email = userinfo.email;

  if (accessToken) {
    const tokenContent = getTokenContent(accessToken);
  }

  if (token.refresh_token) {
    serviceData.refreshToken = token.refresh_token;
  }
  if (debug) console.log('XXX: serviceData:', serviceData);

  const profile = {};
  profile.name = userinfo.displayName;
  profile.email = userinfo.email;
  if (debug) console.log('XXX: profile:', profile);

  return {
    serviceData,
    options: { profile },
  };
});

let userAgent = 'Meteor';
if (Meteor.release) {
  userAgent += '/' + Meteor.release;
}

let getToken = function (query) {
  const debug = false;
  const config = getConfiguration();
  const serverTokenEndpoint = config.serverUrl + config.tokenEndpoint;
  let response;

  try {
    response = HTTP.post(
      serverTokenEndpoint,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent,
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('hsl', config),
          grant_type: 'authorization_code',
          state: query.state,
        },
      }
    );
  } catch (err) {
    throw _.extend(new Error('Failed to get token from OIDC ' + serverTokenEndpoint + ': ' + err.message),
      { response: err.response });
  }
  if (response.data.error) {
    // if the http response was a json object with an error attribute
    throw new Error('Failed to complete handshake with OIDC ' + serverTokenEndpoint + ': ' + response.data.error);
  } else {
    if (debug) console.log('XXX: getToken response: ', response.data);
    return response.data;
  }
};

let getUserInfo = function (accessToken) {
  const debug = false;
  const config = getConfiguration();
  const serverUserinfoEndpoint = config.serverUrl + config.userinfoEndpoint;
  let response;
  try {
    response = HTTP.get(
      serverUserinfoEndpoint,
      {
        headers: {
          'User-Agent': userAgent,
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );
  } catch (err) {
    throw _.extend(new Error('Failed to fetch userinfo from OIDC ' +
                              serverUserinfoEndpoint + ': ' + err.message),
                   { response: err.response });
  }
  if (debug) console.log('XXX: getUserInfo response: ', response.data);
  return response.data;
};

let getConfiguration = function () {
  let config = ServiceConfiguration.configurations.findOne({ service: 'hsl' });
  if (!config) {
    throw new ServiceConfiguration.ConfigError('Service hsl not configured.');
  }
  return config;
};

let getTokenContent = function (token) {
  let content = null;
  if (token) {
    try {
      const parts = token.split('.');
      const header = JSON.parse(new Buffer(parts[0], 'base64').toString());
      content = JSON.parse(new Buffer(parts[1], 'base64').toString());
      const signature = new Buffer(parts[2], 'base64');
      const signed = parts[0] + '.' + parts[1];
    } catch (err) {
      this.content = {
        exp: 0,
      };
    }
  }
  return content;
};

Hsl.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

