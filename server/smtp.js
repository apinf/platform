import { mailSettingsValid } from '/lib/helperFunctions/validateSettings';

Meteor.startup(function() {
  /*extend settings.json with username and password:
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

      const server = "smtp.mailgun.org";
      const port = "587"

      process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
    }
  }
  // otherwise show an error
  catch (error) {
    console.log(error);
  }
});
