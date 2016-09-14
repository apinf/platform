import { contactEmailValid } from '/core/helper_functions/validate_settings';
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
  contactDetailsValid () {
    const settings = Settings.findOne();

    return contactEmailValid(settings);
  },
});
