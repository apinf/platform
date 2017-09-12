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
  instance.subscribe('userManagedApisName');

  // Subscribe to organization apis
  instance.subscribe('organizationApis');

  // Subscribe to organizations basic details
  instance.subscribe('allOrganizationBasicDetails');
});

Template.featuredApiBranding.helpers({
  featuredApi () {
    if (Template.instance().subscriptionsReady()) {
      const branding = Branding.findOne();

      let api = [];

      if (branding.featuredApis && branding.featuredApis.length !== 0) {
        for (const apiId of branding.featuredApis) {
          api.push(Apis.findOne(apiId));
        }

        // Retrieve last API Backends
        return api;
      }
      return false;
    }
    return false;
  },
});
