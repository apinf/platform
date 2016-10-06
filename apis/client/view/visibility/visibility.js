import { Template } from 'meteor/templating';

import { Apis } from '/apis/collection';

Template.visibilityToggle.helpers({
  visible () {
    // Get API from template data
    const api = Template.currentData().api;

    // Get ID of current service
    const apiId = api._id;

    // Check visibility status
    const status = Apis.findOne(apiId).visibility;

    return status;
  },
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
});
