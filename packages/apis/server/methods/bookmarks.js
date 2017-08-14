/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import Apis from '/packages/apis/collection';

Meteor.methods({
  setAllApiBackendBookmarkCounts () {
    // Get all API Backends
    const apiBackends = Apis.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach((apiBackend) => {
      // Set average rating value for current API Backend
      apiBackend.setBookmarkCount();
    });
  },
});
