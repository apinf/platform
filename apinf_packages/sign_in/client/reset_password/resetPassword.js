/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

Template.resetPassword.events({
  'submit #at-reset-password-form': function (event) {
    event.preventDefault();

    // Get user email
    const userEmail = $('#at-field-email').val();

    // send reset password email
    Accounts.forgotPassword({ email: userEmail }, (err, res) => {
      if (err || !res) {
        $('#alert-message').css('display', 'block')
          .removeClass('at-result alert-success')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__('user_resetPassword_message'));
      } else {
        $('#alert-message').css('display', 'none').removeClass('at-error alert-danger').text('');
        FlowRouter.go('/');
      }
    });
  },
});
