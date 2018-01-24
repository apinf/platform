/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';
import { describe, it, before, after } from 'meteor/practicalmeteor:mocha';

if (Meteor.isServer) {
  describe('Functionality: Update', () => {
    before(() => {
      Meteor.users.remove({});
      const userData = {
        email: 'random@gmail.com',
        username: 'random-name',
        password: 'Pass@123',
      };
      Accounts.createUser(userData);
    });
    after(() => {
      Meteor.users.remove({ email: 'random@gmail.com' });
    });
    it('Success: User Updated', () => {
      chai.assert.equal(
        Meteor.users.update({ username: 'random-name' }, {
          $set: {
            profile: {
              name: 'Random',
            },
          },
        }),
      1);
    });
  });
}
