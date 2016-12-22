import { Apis } from '/apis/collection';
import { Template } from 'meteor/templating';

Template.latestApis.onCreated(function () {
  // Reference to Template instance
  const instance = this;

  // Placeholder to keep track of query limit
  let limit;

  // Limit for latest Api Backends passed to the template
  if (instance.data && instance.data.limit) {
    limit = instance.data.limit;
  } else {
    // Set default limit 8
    limit = 8;
  }

  // Subscribe to latestApiBackends publication & pass limit parameter
  instance.subscribe('latestPublicApis', limit);
});

Template.latestApis.helpers({
  latestApis () {
    // Retrieve last API Backends
    return Apis.find({}, { sort: { created_at: -1 } }).fetch();
  },
});
