import { Branding } from '../collection';

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
    // Return reference to branding collection, for AutoForm
    return Branding;
  }
});
