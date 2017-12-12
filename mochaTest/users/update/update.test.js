/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
  describe('Update', function () {
    beforeEach(function () {
      Meteor.users.remove({})
      const userData = {
        email: 'random@gmail.com',
        username: 'random-name',
        password: 'Pass@123',
      };
      Accounts.createUser(userData);
    });
    it('Success: User Updated', function () {
      chai.assert.equal(
        Meteor.users.update({ username:'random-name' }, {
          $set:{
            profile:{
              name: 'Random',
            },
          },
        }),
      1);
    });
  });
}
