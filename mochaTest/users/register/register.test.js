/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base'

if (Meteor.isServer) {
    describe('Register', function() {
        beforeEach(function() {
            Meteor.users.remove({});
            const userData = {
                email: "random@gmail.com",
                username: "random-name",
                password: "Pass@123"
            };
            Accounts.createUser(userData);
        });
        it('Success: User Registered', function() {
            chai.assert.equal(Meteor.users.find().fetch().length, 1);
        });
    });
}
