/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Template.visibilityToggle.events({
  'click .changeVisibility': function () {
    // Get API from template data
    const api = Template.currentData().api;

    // Get ID of current service
    const apiId = api._id;

    // Set the isPublic property to the opposite of its current value
    Apis.update(apiId, { $set: { isPublic: !api.isPublic } });
  },
});

Template.visibilityToggle.helpers({
  isPublic () {
    // Get API from template data
    const api = Template.currentData().api;

    // Get ID of current service
    const apiId = api._id;

    // Get api data
    const apiData = Apis.findOne(apiId);

    // Check apiData is defined or not
    if (apiData) {
      // Return visibility status
      return apiData.isPublic;
    }
    return false;
  },
});
