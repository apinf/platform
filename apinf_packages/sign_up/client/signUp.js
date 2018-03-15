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


/*import './signUp.html';*/

Template.signUp.onCreated(function () {
  
});

Template.signUp.helpers({
  
});

Template.signUp.events({
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
    
    if ($('#at-field-password').val() !== $('#at-field-password_again').val()){
      $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text("Password not matched");
    }
    const user = {
      username: $('#at-field-username').val(),
      email: $('#at-field-email').val(),
      password: $('#at-field-password').val()
    }

    // create user
    Meteor.call('user.register', user, (err, res) => {
      if (err || !res) {
        $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text("User not created");
      } else {
        if (res === "failed") {
          $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text(res.message);
        } else {
          $('#alert-message').css('display', 'block').addClass('at-error alert-danger').text(res.message);
        }
      }
    });
  },
});
