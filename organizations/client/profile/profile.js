import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/organizations/collection/';


Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(function () {
    // Get the Organization slug from the route
    const organizationSlug = FlowRouter.getParam('slug');

    // Make sure organizationSlug exists,
    // fixes bug when changing route to navigate to different page
    if (organizationSlug) {
      // Reactively subscribe to a single Organization
      // Makes sure proper data is available when editing organization name
      instance.organizationSubscription = instance.subscribe('singleOrganization', organizationSlug);

      // Subscribe to Organization APIs documents
      instance.subscribe('organizationApis', organizationSlug);

      // Subscribe to Organization APIs documents
      instance.subscribe('organizationApiLinksByOrganizationSlug', organizationSlug);
    }
  });
});

Template.organizationProfile.helpers({
  organization () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Get single Organization
    return Organizations.findOne({ slug });
  },
  managedApis () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Init managedApis
    let managedApis;

    // Find relate organization document
    const organization = Organizations.findOne({ slug });

    // Check organization exist
    if (organization) {
      // Get organization apis
      managedApis = organization.apis();
    }

    // Return managedApis
    return managedApis;
  },
  managedApisCount () {
    // Get the Organization slug from the route
    const slug = FlowRouter.getParam('slug');

    // Init managedApisCount
    let managedApisCount = 0;

    // Find relate organization document
    const organization = Organizations.findOne({ slug });

    // Check organization exist
    if (organization) {
      // Get organization apis count
      managedApisCount = organization.apisCount();
    }

    // Return managedApisCount
    return managedApisCount;
  },
});
