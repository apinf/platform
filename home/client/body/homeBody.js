import { mailSettingsValid, contactEmailValid } from '/core/helper_functions/validate_settings';
import { Settings } from '/settings/collection';

Template.homeBody.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to settings publication
  instance.subscribe('singleSetting', 'mail.enabled');
});

Template.homeBody.rendered = function () {
  $('.contact-us-link').click(function () {
    document.getElementById('contact-us').scrollIntoView();
  });
};

Template.homeBody.helpers({
  contactFormEnabled () {
    const settings = Settings.findOne();

    // Placeholder for mail enabled Check
    let mailEnabled;

    // Check if mail is enabled
    if (settings && settings.mail && settings.mail.enabled) {
      mailEnabled = true;
    }

    return mailEnabled;
  },
});
