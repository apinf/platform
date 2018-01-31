/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Npm packages imports
import _ from 'lodash';
import URI from 'urijs';

const getUrlAndAuthStrings = (url) => {
  // Init URI object instance
  const uri = new URI(url);

  /* eslint-disable no-underscore-dangle */
  // Construct auth string
  const auth = `${uri._parts.username}:${uri._parts.password}`;

  // Delete username & password credentials
  delete uri._parts.username;
  delete uri._parts.password;

  // Re-construct URI instance without auth credentials
  uri.normalize();

  // Retrun object with both values
  return {
    auth,
    url: `${uri.valueOf()}`,
  };
};

Meteor.methods({
  // Meteor method to get all users from emq-rest-api
  async getEmqUsers (emqHttpApi) {
    check(emqHttpApi, String);

    // Get url and auth strings from HTTP API URL
    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    // Init uri instance based on url value
    const uri = new URI(url);
    // Apppend path name to uri
    uri.pathname('/emq-user');

    const p = new Promise((resolve, reject) => {
      // Send HTTP GET request to emq rest api
      HTTP.call('GET', uri.toString(), { auth }, (err, res) => {
        if (err) reject(err);

        // Expose only username and ID
        let users = res ? res.data : [];
        users = _.map(users, (user) => {
          return {
            id: user.id,
            username: user.username,
          };
        });
        resolve(users);
      });
    });

    return await p;
  },
  // Meteor method to remove user from emq-rest-api
  async removeEmqUser (emqHttpApi, userId) {
    check(emqHttpApi, String);
    check(userId, Number);

    // Get url and auth strings from HTTP API URL
    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    // Init uri instance based on url value
    const uri = new URI(url);
    // Apppend path name to uri
    uri.pathname(`/emq-user/${userId}`);

    const p = new Promise((resolve, reject) => {
      // Send HTTP DELETE request to emq rest api
      HTTP.call('DELETE', uri.toString(), { auth }, (err, res) => {
        if (err) reject(err);

        resolve(res.data);
      });
    });

    return await p;
  },
  // Meteor method to add user to emq-rest-api
  async addEmqUser (emqHttpApi, user) {
    check(emqHttpApi, String);
    check(user, Object);

    // Get url and auth strings from HTTP API URL
    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    // Init uri instance based on url value
    const uri = new URI(url);
    // Apppend path name to uri
    uri.pathname('/emq-user');

    const p = new Promise((resolve, reject) => {
      // Send HTTP POST request to emq rest api
      HTTP.call('POST', uri.toString(), { auth, data: user }, (err, res) => {
        if (err) reject(err);

        resolve(res.data);
      });
    });

    return await p;
  },
});
