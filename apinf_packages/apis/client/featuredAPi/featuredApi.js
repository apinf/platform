/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';

Template.featuredApiBranding.onCreated(function () {
  // Reference to Template instance
  const instance = this;


  // Subscribe to userManagedApisName publication
  instance.subscribe('apisForBranding');

  // Subscribe to organization apis
  instance.subscribe('organizationApis');

  // Subscribe to organizations basic details
  instance.subscribe('allOrganizationBasicDetails');
});

Template.featuredApiBranding.helpers({
  featuredApis () {
    const branding = Branding.findOne();
    // Check whether any APIs have been featured
    const haveFeaturedApis = branding.featuredApis && branding.featuredApis.length !== 0;

    if (haveFeaturedApis) {
      // Filter out featured apis from all apis
      const featuredApis = Apis.find({ _id: { $in: branding.featuredApis }}).fetch()
      return featuredApis;
    }
    return false;
  },
});
