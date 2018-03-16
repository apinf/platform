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

Template.signUp.events({
  'click #at-fiware' () {

    // login with fiware
    Meteor.loginWithFiware ((err) => {
      if (err) {
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signup_message_notAbleToSignUpWithFiware"));
      } else {
        $('#alert-message').css('display', 'none')
          .removeClass('at-error alert-danger')
          .text("");
        FlowRouter.go('/');
      }
    });
  },
  'click #at-github' (event) {

    // login with github
    Meteor.loginWithGithub ({
      requestPermission: ['user', 'public_repo']
    }, (err) => {
      if (err) {
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signup_message_notAbleToSignUpWithGitHub"));
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
    
    // check password and confirm password is matched or not
    if ($('#at-field-password').val() !== $('#at-field-password_again').val()){
      $('#alert-message').css('display', 'block')
        .addClass('at-error alert-danger')
        .text(TAPi18n.__("user_signup_message_passwordNotMatched"));
    }

    // get user data
    const user = {
      username: $('#at-field-username').val(),
      email: $('#at-field-email').val(),
      password: $('#at-field-password').val()
    }

    // call meteor method for create user
    Meteor.call('user.register', user, (err, res) => {
      if (err || !res) {
        $('#alert-message').css('display', 'block')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_signup_message_userNotCreated"));
      } else {
        if (res.status === "failed") {
          $('#alert-message').css('display', 'block')
            .addClass('at-error alert-danger')
            .text(res.message);
        } else {
          $('#alert-message').css('display', 'block')
            .addClass('at-error alert-danger')
            .text(res.message);
        }
      }
    });
  },
});
