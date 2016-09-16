import { Settings } from '../collection';
import { githubSettingsValid } from '/core/helper_functions/validate_settings';
import { mailSettingsValid } from '/core/helper_functions/validate_settings';

Meteor.methods({
  'updateGithubConfiguration': function () {
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
    }
    // otherwise show an error
    catch (error) {
      console.log(error);
    }
  },
  'updateMailConfiguration': function () {
    // Try if settings exist
    try {
      const settings = Settings.findOne();

      // Check if mail settings are provided
      if (mailSettingsValid(settings)) {
        const username = settings.mail.username;
        const password = settings.mail.password;

        const smtpHost = settings.mail.smtpHost;
        const smtpPort = settings.mail.smtpPort;

        // Set MAIL_URL env variable
        process.env.MAIL_URL = 'smtp://' +
          encodeURIComponent(username) + ':' +
          encodeURIComponent(password) + '@' +
          encodeURIComponent(smtpHost) + ':' +
          encodeURIComponent(smtpPort);
      }
    }
    // otherwise show an error
    catch (error) {
      console.log(error);
    }
  }
});
