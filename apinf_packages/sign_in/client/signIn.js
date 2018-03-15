/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

/*import './signIn.html';*/

Template.signIn.onCreated(function () {
  
});

Template.signIn.helpers({
  
});

Template.signIn.events({
  'click #at-github' (event) {
    // login with github
    Meteor.loginWithGithub ({
      requestPermission: ['user', 'public_repo']
    }, (err) => {
      if (err) {
        $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text("Not able to register with github");
      } else {
        $('#alert-message').css('display', 'none').removeClass('at-error alert-danger').text("");
        FlowRouter.go('/');
      }
    });
  },
  'submit #at-pwd-form' (event) {
    event.preventDefault();
    
    const user = {
      usernameAndEmail: $('#at-field-username_and_email').val(),
      password: $('#at-field-password').val()
    }

    Meteor.loginWithPassword(user.usernameAndEmail, user.password, (err) => {
      if (err) {
        console.log(err)
        $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text("Login forbidden");
      } else {
        $('#alert-message').css('display', 'none').removeClass('at-error alert-danger').text("");
        FlowRouter.go('/');
      }
    });
  },
});
