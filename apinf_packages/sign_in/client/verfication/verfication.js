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

Template.verfication.events({
  'submit #at-verification-form' (event) {
    event.preventDefault();
    
    // get user email
    const userEmail = $('#at-field-email').val();

    // Call meteor method for send again user verification
    Meteor.call('user.verification', userEmail, (err, res) => {
      if (err || !res) {
        $('#alert-message').css('display', 'block')
          .removeClass('at-result alert-success')
          .addClass('at-error alert-danger')
          .text(TAPi18n.__("user_verification_message"));
      } else {
        console.log(res)
        if (res.status === "failed") {
          $('#alert-message').css('display', 'block')
            .removeClass('at-result alert-success')
            .addClass('at-error alert-danger')
            .text(res.message);
        } else {
          console.log("else")
          $('#alert-message').css('display', 'block')
            .removeClass('at-error alert-danger')
            .addClass('at-result alert-success')
            .text(res.message);
        }
      }
    });
  },
});
