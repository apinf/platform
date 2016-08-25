import { Branding } from '/platform_branding/collection';
import { ProjectLogo } from '/platform_logo/collection';

Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscribe to project logo
  this.subscribe('projectLogo');
};

Template.masterLayout.helpers({
  branding: function () {
    // Check for branding document
    var branding = Branding.findOne();

    if (branding) {
      // If branding is available, return it
      return branding;
    }
  }
});
