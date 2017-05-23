import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

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
  async getEmqUsers (emqHttpApi) {
    check(emqHttpApi, String);

    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    const uri = new URI(url);
    uri.pathname('/emq-user');

    const p = new Promise((resolve, reject) => {
      HTTP.call('GET', uri.toString(), { auth }, (err, res) => {
        if (err) reject(err);

        resolve(res.data);
      });
    });

    return await p;
  },
  async removeEmqUser (emqHttpApi, userId) {
    check(emqHttpApi, String);
    check(userId, Number);

    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    const uri = new URI(url);
    uri.pathname(`/emq-user/${userId}`);

    const p = new Promise((resolve, reject) => {
      HTTP.call('DELETE', uri.toString(), { auth }, (err, res) => {
        if (err) reject(err);

        resolve(res.data);
      });
    });

    return await p;
  },
  async addEmqUser (emqHttpApi, user) {
    check(emqHttpApi, String);
    check(user, Object);

    const { url, auth } = getUrlAndAuthStrings(emqHttpApi);

    const uri = new URI(url);
    uri.pathname('/emq-user');

    const p = new Promise((resolve, reject) => {
      HTTP.call('POST', uri.toString(), { auth, data: user }, (err, res) => {
        if (err) reject(err);

        resolve(res.data);
      });
    });

    return await p;
  },
});
