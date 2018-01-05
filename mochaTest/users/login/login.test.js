/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Accounts } from 'meteor/accounts-base';

import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from '../../test-helper.js';


if (Meteor.isClient) {
  describe('Login', function () {
    let userData = {
      email: 'random@gmail.com',
      username: 'random-name',
      password: 'Pass@123',
    };
    beforeEach(function () {
      console.log('enter ',userData)
      userId = Accounts.createUser(userData);
    });
    console.log('userData.email ',userData.email)
    it('Success: User Login', function () {    
      Meteor.loginWithPassword(userData.email, userData.password, (err, res) => {
        console.log('Err => ',err)
        console.log(userId,' : ',Meteor.userId())
        
        chai.assert.typeOf(Meteor.userId(),'string');
        // chai.should.exist(Meteor.userId());
        
      });
    });
    /*it('Success: Login Page render', function () {
      const item = BlazeLayout.render('signIn');
      console.log(':: item ',item)
      chai.assert(item.find('input').hasClass('form-control'));

      const data = {my:"MY"};
      withRenderedTemplate("addApi", data, (el) => {
        console.log(':: el ',el)
          // In testing, we have inserted one record from method test, Which was from some random userid,
          // So for testing, here we should get pos-list( classes name for <tr>) length to 1
           
          chai.assert.equal($(el).find('#at-field-username_and_email').length, 1);
      });

    });*/
  });
}




      /*describe('Login Render', function() {
        beforeEach(function() {
            Template.registerHelper('_', key => key);
            let userId = Meteor.userId();
        });

        afterEach(function() {
            Template.deregisterHelper('_');
        });

        it('Success: Render Login page', function() {
            const data = {};
            withRenderedTemplate('signIn', data, (el) => {
              console.log(':: userId ',userId)
                // In testing, we have inserted one record from method test, Which was from some random userid,
                // So for testing, here we should get pos-list( classes name for <tr>) length to 1
                 
                chai.assert.equal($(el).find('#at-field-username_and_email').length, 1);
            });
        });
      });*/