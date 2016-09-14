import { mailSettingsValid } from '/lib/helperFunctions/validateSettings';
import { Settings } from '/settings/collection';

Meteor.startup(function () {
  /* extend settings.json with username and password:
  "mail": {
    "username" : "xxxx",
      "password" : "xxxx"
  }*/

  // If settings are available in Meteor.settings
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
});
