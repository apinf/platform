import { Branding } from '/branding/collection';

Template.home.created = function () {
  // Get reference to template instance
  const instance = this;

  // Subscription to branding collection
  instance.subscribe('branding');

  // Run this each time something changes
  instance.autorun(function () {
    // Check for template subscriptions
    if (instance.subscriptionsReady) {
      // Get Branding collection content
      var branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        var title = branding.siteTitle;
        DocHead.setTitle(title);
      }
    }
  });
};

Template.home.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  }
});
