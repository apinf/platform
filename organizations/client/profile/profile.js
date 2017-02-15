// Meteor packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Organizations from '/organizations/collection/';

Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(() => {
    // Get the Organization slug from the route
    const organizationSlug = FlowRouter.getParam('slug');

    // Make sure organizationSlug exists,
    // fixes bug when changing route to navigate to different page
    if (organizationSlug) {
      // Reactively subscribe to a single Organization composite
      // Makes sure proper data is available when editing organization name
      instance.subscribe('organizationComposite', organizationSlug);
      // Subscribe to OrganizationAPIs link documents
      instance.subscribe('organizationApiLinksByOrganizationSlug', organizationSlug);

      // Get Organization document
      const organization = Organizations.findOne({ slug: organizationSlug });

      if (organization) {
        // If user is admin or organization manager
        if (organization.currentUserCanManage()) {
          // Get IDs of managed APIs via collection helper
          const managedApiIds = organization.managedApiIds();

          // Then publish all managed APIs of organization
          instance.subscribe('apisByIds', managedApiIds);
        } else {
          // Otherwise publish user's visible APIs
          instance.subscribe('userVisibleApis', organizationSlug);
        }
      }
    }
  });
});

Template.organizationProfile.helpers({
  organization () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Get Organization, based on slug
    return Organizations.findOne({ slug });
  },
});
