/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.apiCard.onCreated(function () {
  // Get reference to template instance
  const instance = this;
  // Get id of API
  const apiId = instance.data.api._id;
  // Subscribe to basic details of related api metadata
  instance.subscribe('apiOrganizationBasicDetails', apiId);
});
