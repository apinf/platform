/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection/';

Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;
  instance.organization = new ReactiveVar();

  // Using to get updated subscription
  instance.autorun(() => {
    // Get the Organization slug from the route
    const organizationSlug = FlowRouter.getParam('orgSlug');

    if (organizationSlug) {
      // Subscribe to Organization document
      instance.subscribe('organizationComposite', organizationSlug);
      // Subscribe to OrganizationAPIs link documents
      instance.subscribe('organizationApiLinksByOrganizationSlug', organizationSlug);
    }
  });

  instance.autorun(() => {
    // Get path parameter
    const slug = FlowRouter.getParam('orgSlug');

    // Get related Organization
    const organization = Organizations.findOne({ slug });

    if (organization) {
      // Store it
      this.organization.set(organization);
    }
  });
});

Template.organizationProfile.helpers({
  organization () {
    return Template.instance().organization.get();
  },
});
