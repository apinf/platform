import { Template } from 'meteor/templating';

import { Apis } from '/apis/collection';


Template.visibilityToggle.events({
  'click .changeVisibility': function (event) {
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

    // Check visibility status
    const status = Apis.findOne(apiId).isPublic;

    return status;
  },
});
