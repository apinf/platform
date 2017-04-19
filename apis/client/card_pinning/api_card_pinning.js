/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apis/collection';

Template.pinApiCard.events({
  'click .pin-button': function () {
    // Get API from template data
    const api = Template.currentData().api;

    // Get ID of current service
    const apiId = api._id;

    // Set the isFeatured property to the opposite of its current value
    Apis.update(apiId, { $set: { isFeatured: !api.isFeatured } });
  },
});

Template.pinApiCard.helpers({
  isFeatured () {
    // Get API from template data
    const api = Template.currentData().api;

    // Get ID of current service
    const apiId = api._id;

    // Check visibility status
    const status = Apis.findOne(apiId).isFeatured;

    return status;
  },
});
