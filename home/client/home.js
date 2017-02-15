// Meteor packages imports
import { DocHead } from 'meteor/kadira:dochead';

// Collection imports
import Branding from '/branding/collection';

Template.home.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscription to branding collection
  instance.subscribe('branding');

  // Run this each time something changes
  instance.autorun(() => {
    // Check for template subscriptions
    if (instance.subscriptionsReady) {
      // Get Branding collection content
      const branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        const title = branding.siteTitle;
        DocHead.setTitle(title);
      }
    }
  });
});

Template.home.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
});
