import { contactEmailValid } from '/lib/helperFunctions/validateSettings';

Template.homeBody.onCreated(function () {

  // Subscribe to settings publication
  this.subscribe('settings');
});

Template.homeBody.rendered = function () {
  $(".contact-us-link").click(function () {
    document.getElementById("contact-us").scrollIntoView();
  });
};

Template.homeBody.helpers({
  contactDetailsValid () {

    const settings = Settings.findOne();

    return contactEmailValid(settings);
  }
})
