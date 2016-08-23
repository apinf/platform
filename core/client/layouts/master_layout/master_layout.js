import { ProjectLogo } from '/settings/logo/collection';

Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscribe to project logo
  this.subscribe('projectLogo');
};

Template.masterLayout.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  }
});
