/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/imports/apis/collection';

Meteor.methods({
  setAllApiBackendAverageRatings () {
    // Get all API Backends
    const apiBackends = Apis.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach((apiBackend) => {
      // Make sure apiBackend is an Api schema
      check(apiBackend, Apis.schema);

      // Set average rating value for current API Backend
      apiBackend.setAverageRating();
    });
  },
  setApiBackendAverageRating (apiBackendId) {
    // Make sure apiBackendId is a String
    check(apiBackendId, String);

    // Get API Backend
    const apiBackend = Apis.findOne(apiBackendId);

    // Update the API Backend bookmark count
    apiBackend.setAverageRating();
  },
});
