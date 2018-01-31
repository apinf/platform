/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { describe, it, before } from 'meteor/practicalmeteor:mocha';

if (Meteor.isClient) {
  describe('Functionality: Login', () => {
    const userData = {
      email: 'random1@gmail.com',
      username: 'random1-name',
      password: 'Pass@123',
    };
    before(() => {
      new Promise((result, revoke) => {
        Meteor.call('userCreate', userData, (err, res) => {
          if (err || !res) revoke(err || false);
          else result(res);
        });
      }).then(() => {
        Meteor.loginWithPassword(userData.email, userData.password);
      });
    });
    it('Success: User Login', () => {
      chai.assert.typeOf(Meteor.userId(), 'string');
    });
  });
}
