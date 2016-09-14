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

Template.homeBody.events({
  'click .resend-verification-link' ( event, template ) {
    Meteor.call( 'sendVerificationLink', ( error, response ) => {
      if ( error ) {
        sAlert.error(error.reason);
      } else {
        let email = Meteor.user().emails[ 0 ].address;
        sAlert.success('New verification link sent to email');
      }
    });
  }
});

Template.homeBody.helpers({
  contactFormEnabled () {
    const settings = Settings.findOne();

    // Check mail is enabled & contact email has been given
    if(settings.mail.enabled && contactEmailValid(settings)) {
      return true;
    } else {
      return false;
    }
  },
});
