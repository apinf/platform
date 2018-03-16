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

Template.signIn.events({
  'click #at-fiware' () {

    // login with fiware
    Meteor.loginWithFiware ((err) => {
      console.log(err)
      if (err) {
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signin_message_notAbleToSignInWithFiware"));
      } else {
        $('#alert-message').css('display', 'none')
          .removeClass('at-error alert-danger')
          .text("");
        FlowRouter.go('/');
      }
    });
  },
  'click #at-github' () {

    // login with github
    Meteor.loginWithGithub ({
      requestPermission: ['user', 'public_repo']
    }, (err) => {
      if (err) {
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signin_message_notAbleToSignInWithGitHub"));
      } else {
        $('#alert-message').css('display', 'none')
          .removeClass('at-error alert-danger')
          .text("");
        FlowRouter.go('/');
      }
    });
  },
  'submit #at-pwd-form' (event) {
    event.preventDefault();
    
    // get user data email and password
    const user = {
      usernameAndEmail: $('#at-field-username_and_email').val(),
      password: $('#at-field-password').val()
    }

    // login with email and password
    Meteor.loginWithPassword(user.usernameAndEmail, user.password, (err) => {
      if (err) {
        console.log(err)
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signin_message_loginForbidden"));
      } else {
        $('#alert-message').css('display', 'none')
          .removeClass('at-error alert-danger')
          .text("");
        FlowRouter.go('/');
      }
    });
  },
});
