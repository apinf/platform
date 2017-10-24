/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';

Template.homePageApis.onCreated(function () {
  // Reference to Template instance
  const templateInstance = this;

  // Get Branding configuration
  const branding = Branding.findOne();

  // Get featured APIs IDs
  const featuredApis = branding && branding.featuredApis;

  // Check if feature apis exist
  if (featuredApis) {
    // Subscribe to featured APIs
    templateInstance.subscribe('homePageApis', featuredApis);

    // Subscribe to organization apis
    templateInstance.subscribe('organizationApis');

    // Subscribe to organizations basic details
    templateInstance.subscribe('allOrganizationBasicDetails');
  }
});

Template.homePageApis.helpers({
  featuredApis () {
    // Get Branding configuration
    const branding = Branding.findOne();

    // Get featured APIs IDs
    const featuredApis = branding && branding.featuredApis;

    let apis;

    // Check if feature apis exist
    if (featuredApis) {
      // Save featured APIs
      apis = Apis.find().fetch();
    }

    return apis;
  },
});
