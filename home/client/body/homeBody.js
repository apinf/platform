import { mailSettingsValid, contactEmailValid } from '/core/helper_functions/validate_settings';
import { Settings } from '/settings/collection';

Template.homeBody.onCreated(function () {
  // Subscribe to settings publication
  this.subscribe('settings');
});

Template.homeBody.rendered = function () {
  $('.contact-us-link').click(function () {
    document.getElementById('contact-us').scrollIntoView();
  });
};

Template.homeBody.helpers({
  contactFormEnabled () {
    const settings = Settings.findOne();

    // Check mail settings are valid & contact email has been given
    return mailSettingsValid(settings) && contactEmailValid(settings);
  },
});
