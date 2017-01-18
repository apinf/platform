import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { Apis } from '/apis/collection';

Meteor.methods({
  setAllApiBackendAverageRatings () {
    // Get all API Backends
    const apiBackends = Apis.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach((apiBackend) => {
      // Make sure apiBackend is an ApiSchema
      check(apiBackend, Apis.schema);

      // Set average rating value for current API Backend
      apiBackend.setAverageRating();
    });
  },
  setApiBackendAverageRating (apiBackendId) {
    // Make sure apiBackend is an ApiSchema
    check(apiBackendId, String);

    // Get API Backend
    const apiBackend = Apis.findOne(apiBackendId);

    // Update the API Backend bookmark count
    apiBackend.setAverageRating();
  },
});
