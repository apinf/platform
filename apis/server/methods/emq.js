import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

import URI from 'urijs';

Meteor.methods({
  async getEmqUsers (url, auth) {
    check(url, String);
    check(auth, String);

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
});
