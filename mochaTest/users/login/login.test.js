/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isClient) {
  describe('Login', function () {
    let userId;
    let userData = {};
    beforeEach(function () {
      userData = {
        email: 'random@gmail.com',
        username: 'random-name',
        password: 'Pass@123',
      };
      userId = Accounts.createUser(userData);
    });
    it('Success: User Login', function () {
      Meteor.loginWithPassword(userData.email, userData.password, (err) => {
        chai.assert.equal(Meteor.userId(), userId);
      });
    });
  });
}
