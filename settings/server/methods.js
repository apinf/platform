// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

// Apinf import
import { githubSettingsValid, mailSettingsValid } from '/core/helper_functions/validate_settings';
import { loginAttemptVerifier } from '/core/helper_functions/login_verify';
import { Settings } from '../collection';

Meteor.methods({
  configureSmtpSettings (settings) {
    // Check if mail settings are provided
    if (mailSettingsValid(settings)) {
      const username = settings.mail.username;
      const password = settings.mail.password;

      const smtpHost = settings.mail.smtpHost;
      const smtpPort = settings.mail.smtpPort;

      // Set MAIL_URL env variable
      process.env.MAIL_URL = `
        smtp://${encodeURIComponent(username)}:
        ${encodeURIComponent(password)}@
        ${encodeURIComponent(smtpHost)}:
        ${encodeURIComponent(smtpPort)}
      `;
    }
  },
  updateGithubConfiguration () {
    // Try if settings exist
    try {
      const settings = Settings.findOne();

      // Check if github settings are valid
      if (githubSettingsValid(settings)) {
        // remove existing configuration
        ServiceConfiguration.configurations.remove({
          service: 'github',
        });

        // Insert new service configuration
        ServiceConfiguration.configurations.insert({
          service: 'github',
          clientId: settings.githubConfiguration.clientId,
          secret: settings.githubConfiguration.secret,
        });
      }
    } catch (error) {
      // otherwise show an error
      const message = `Update gitHub configuration: ${error}`;

      console.log(message);
    }
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
      } else {
        console.log('email disabled');
      }
    } catch (error) {
      // otherwise preapare message about error
      const message = `Update mail configuration: ${error}`;

      // Show an error message
      console.log(message);
    }
  },
});
