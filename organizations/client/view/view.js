import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { OrganizationApis } from '/apis/collection';
import { Organizations } from '/organizations/collection/';


Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the Organization slug from the route
  instance.organizationSlug = FlowRouter.getParam('slug');

  // Subscribe to APIs
  instance.subscribe('allApiBackends', Meteor.userId());
  // Subscribe to a single Organization
  instance.subscribe('singleOrganization', instance.organizationSlug);
});

Template.organizationProfile.helpers({
  organization () {
    // Get single Organization
    return Organizations.findOne();
  },
  managedApis () {
    // Init managedApis
    let managedApis = [];
    // Find relate organization document
    const organization = Organizations.findOne();

    // Check organization exist
    if (organization) {
      // Get organization id
      const organizationId = organization._id;

      // Get organizationApis
      const organizationApis = OrganizationApis.findOne({ organizationId });

      // Check organizationApis exist
      if (organizationApis) {
        // Get cursor to apis
        managedApis = organizationApis.cursorApis();
      }
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
      // Get organization id
      const organizationId = organization._id;

      // Get organizationApis
      const organizationApis = OrganizationApis.findOne({ organizationId });

      // Check organizationApis exist
      if (organizationApis) {
        // Get count of apis
        managedApisCount = organizationApis.count();
      }
    }
    // Return managedApisCount
    return managedApisCount;
  },
});
