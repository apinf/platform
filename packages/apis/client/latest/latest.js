/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/packages/apis/collection';

Template.latestPublicApis.onCreated(function () {
  // Reference to Template instance
  const instance = this;

  // Apis query limit (default: 8)
  let limit = 8;

  // Override default limit if passed in as template argument
  if (instance.data && instance.data.limit) {
    limit = instance.data.limit;
  }

  // Subscribe to latestApiBackends publication & pass limit parameter
  instance.subscribe('latestPublicApis', limit);

  // Subscribe to organization apis
  instance.subscribe('organizationApis');

  // Subscribe to organizations basic details
  instance.subscribe('allOrganizationBasicDetails');
});

Template.latestPublicApis.helpers({
  latestPublicApis () {
    // Retrieve last API Backends
    return Apis.find({}, { sort: { created_at: -1 } }).fetch();
  },
});
