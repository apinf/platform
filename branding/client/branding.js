// Collection imports
import Branding from '/branding/collection';

Template.branding.onCreated(function () {
  const instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');

  instance.subscribe('projectLogo');
});

Template.branding.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
  brandingCollection () {
    return Branding;
  },
});
