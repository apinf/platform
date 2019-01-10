/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.atOauth.onRendered(() => {
  // Show or hide existing OAuth method buttons according to values of settings
  Meteor.call('getSettings', (error, result) => {
    if (error) throw new Meteor.Error(error);
    if (result) {
      // If standard login is installed
      if (document.getElementById('at-pwd-form')) {
        // Hide the username field, psw field and button, if needed
        if (result.loginMethods.username_psw) {
          document.getElementById('at-pwd-form').style.display = 'none';
        }
      }
      if (document.getElementsByClassName('at-signup-link')) {
        // Hide the sig-up link, if needed
        if (result.loginMethods.username_psw) {
          document.getElementsByClassName('at-signup-link')[0].style.display = 'none';
        }
      }
      if (document.getElementsByClassName('at-resend-verification-email-link')) {
        // Hide the resend verification email link, if needed
        if (result.loginMethods.username_psw) {
          /* eslint-disable max-len */
          document.getElementsByClassName('at-resend-verification-email-link')[0].style.display = 'none';
        }
      }

      // If Fiware is installed
      if (document.getElementById('at-fiware')) {
        // Hide the button, if needed
        if (result.loginMethods.fiware) {
          document.getElementById('at-fiware').style.display = 'none';
        }
      }
      // If Github is installed
      if (document.getElementById('at-github')) {
        // Hide the button, if needed
        if (result.loginMethods.github) {
          document.getElementById('at-github').style.display = 'none';
        }
      }
      // If HSL is installed
      if (document.getElementById('at-hsl')) {
        // Hide the button, if needed
        if (result.loginMethods.hsl_id) {
          document.getElementById('at-hsl').style.display = 'none';
        }
      }
    }
  });
});
