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

    // Subscribe to a single Organization
    instance.subscribe('singleOrganization', organizationSlug);

    // Subscribe to Organization APIs documents
    instance.subscribe('organizationApis', organizationSlug);

    // Subscribe to Organization APIs documents
    instance.subscribe('organizationApiLinksByOrganizationSlug', organizationSlug);
  });
});

Template.organizationProfile.helpers({
  organization () {
    // Get single Organization
    return Organizations.findOne();
  },
  managedApis () {
    // Init managedApis
    let managedApis;

    // Find relate organization document
    const organization = Organizations.findOne();

    // Check organization exist
    if (organization) {
      // Get organization apis
      managedApis = organization.apis();
    }

    // Return managedApis
    return managedApis;
  },
  managedApisCount () {
    // Init managedApisCount
    let managedApisCount = 0;

    // Find relate organization document
    const organization = Organizations.findOne();

    // Check organization exist
    if (organization) {
      // Get organization apis count
      managedApisCount = organization.apisCount();
    }

    // Return managedApisCount
    return managedApisCount;
  },
});
