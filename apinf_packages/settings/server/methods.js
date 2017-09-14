/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';

// APInf imports
import {
  mailSettingsValid,
} from '/apinf_packages/core/helper_functions/validate_settings';

// Collection imports
import Settings from '../collection';

Meteor.methods({
  configureSmtpSettings () {
    // Get current settings
    const settings = Settings.findOne();

    // Check if mail settings are provided
    if (mailSettingsValid(settings)) {
      const username = encodeURIComponent(settings.mail.username);
      const password = encodeURIComponent(settings.mail.password);

      const smtpHost = encodeURIComponent(settings.mail.smtpHost);
      const smtpPort = encodeURIComponent(settings.mail.smtpPort);

      // Set MAIL_URL env variable
      // Note, this must be on one, long line for the URL to be valid
      process.env.MAIL_URL = `smtp://${username}:${password}@${smtpHost}:${smtpPort}`;

      // Set the 'from email' address, so that mail can send properly
      Accounts.emailTemplates.from = settings.mail.fromEmail;
    }
  },
  disableAccountEmailSettings () {
    // NOTE: This does not work
    // TODO: figure out if/how we can dynamically toggle AccountsTemplates settings
    // specifically, those related to verification email and password reset

    // Disable email related features / links for accounts templates
    // AccountsTemplates.configure({
    //   /* Verification */
    //   sendVerificationEmail: false,
    //   showResendVerificationEmailLink: false,
    //   /* Password */
    //   showForgotPasswordLink: false,
    // });
  },
  enableAccountEmailSettings () {
    // NOTE: This does not work
    // TODO: figure out if/how we can dynamically toggle AccountsTemplates settings
    // specifically, those related to verification email and password reset

    // Enable email related features / links for accounts templates
    // AccountsTemplates.configure({
    //   /* Verification */
    //   sendVerificationEmail: true,
    //   showResendVerificationEmailLink: true,
    //   /* Password */
    //   showForgotPasswordLink: true,
    // });
  },

  updateMailConfiguration () {
    // Try if settings exist
    try {
      // Get Settings collection
      const settings = Settings.findOne();

      // Enable/disable accounts email features based on email configuration
      if (settings.mail.enabled) {
        // Configure system SMTP variable for sending mail
        Meteor.call('configureSmtpSettings', settings);

        // Enable accounts email related features (validation, reset password)
        Meteor.call('enableAccountEmailSettings');
      } else {
        // No email verification or reset password functionality
        Meteor.call('disableAccountEmailSettings');
      }
    } catch (error) {
      // otherwise preapare message about error
      const message = `Update mail configuration: ${error}`;

      // Show an error message
      throw new Meteor.Error(message);
    }
  },
});
