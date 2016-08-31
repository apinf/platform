import { Branding } from '/branding/collection';

Template.branding.created = function () {
  var instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');

  instance.subscribe('projectLogo');
};

Template.branding.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  },
  brandingCollection () {
    return Branding;
  }
});
