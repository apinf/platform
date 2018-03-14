/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiBackendRatings from '../collection';

Template.apiBackendRating.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get API Backend ID from template instance
  const apiBackendId = instance.data._id;

  // Subscribe to rating for current API Backend
  instance.apiRatingSubscription = instance.subscribe(
    'myApiBackendRating',
    apiBackendId
  );

  // Subscribe to ratings for current API Backend
  instance.apiBackendRatings = instance.subscribe(
    'apiBackendRatings',
    apiBackendId
  );
});

Template.apiBackendRating.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Get API Backend ID from template instance
  const apiBackendId = instance.data._id;

  // get API Backend document
  const apiBackend = Apis.findOne(apiBackendId);

  instance.autorun(() => {
    // Make sure API Backend Rating subscription is ready
    if (instance.apiRatingSubscription.ready()) {
      // Check if user has previously rated API Backend
      const userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId: Meteor.userId(),
      });

      // Add the jQuery RateIt widget
      $(`#rating-${apiBackendId}`).rateit({
        max: 4,
        step: 1,
        resetable: false,
        // Only logged in user can rate
        readonly: !Meteor.userId(),
        // use previous rating, if exists
        value: userRating ? userRating.rating : apiBackend.averageRating,
      });
    }
  });
});

Template.apiBackendRating.events({
  'click .rateit': function (event, templateInstance) {
    // Make sure there is a Meteor user ID for voting
    if (Meteor.userId() === null) {
      // Get translated user message
      const message = TAPi18n.__('apiBackendRating_anonymousError');

      // Alert the user that they must log in
      sAlert.error(message, { timeout: 'none' });

      return false;
    }

    // Get API Backend ID from template data context
    const apiBackendId = templateInstance.data._id;

    // Get rating from template based on API Backend ID
    const rating = $(`#rating-${apiBackendId}`).rateit('value');

    // Get current user ID
    const userId = Meteor.userId();

    // Create an rating object with user ID, API Backend ID, and rating
    const apiBackendRating = {
      apiBackendId,
      userId,
      rating,
    };

    // Check if user has previously rated API Backend
    const previousRating = ApiBackendRatings.findOne({
      apiBackendId,
      userId,
    });

    // If previous rating exists
    if (previousRating) {
      // Update the existing rating
      ApiBackendRatings.update(previousRating._id, { $set: apiBackendRating });
    } else {
      // Otherwise, create a new rating
      ApiBackendRatings.insert(apiBackendRating);
    }

    // Update the API Backend average rating
    return Meteor.call('setApiBackendAverageRating', apiBackendId);
  },
});

Template.apiBackendRating.helpers({
  userRatingClass () {
    // Get reference to template instance
    const instance = Template.instance();

    let userOwnRating;
    if (instance.apiRatingSubscription.ready()) {
      // Determine if user has rated API Backend
      // Get API Backend ID from template data context
      const apiBackendId = instance.data._id;

      // Get current user ID
      const userId = Meteor.userId();

      // Check if user has previously rated API Backend
      const previousRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId,
      });

      // If previous rating exists
      if (previousRating) {
        // Return user rating class
        userOwnRating = 'user-own-rating';
      }
    }
    return userOwnRating;
  },
  ratingCount () {
    // Get reference to template instance
    const instance = Template.instance();

    let apiBackendRatingsCount;

    // Make sure API Ratings subscription is ready
    if (instance.apiRatingSubscription.ready()) {
      // Get API Backend ID
      const apiBackendId = instance.data._id;

      // Get all ratings for current API Backend
      const apiBackendRatings = ApiBackendRatings.find({ apiBackendId });

      // Get the count of API Backend ratings
      apiBackendRatingsCount = apiBackendRatings.count();
    }
    return apiBackendRatingsCount;
  },
  userHasRating () {
    // Get reference to template instance
    const instance = Template.instance();

    let previousRating;
    if (instance.apiRatingSubscription.ready()) {
      // Determine if user has rated API Backend
      // Get API Backend ID from template data context
      const apiBackendId = instance.data._id;

      // Get current user ID
      const userId = Meteor.userId();

      // Check if user has previously rated API Backend
      previousRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId,
      });
    }
    // If previous rating exists return user rating class
    return !!(previousRating);
  },
});
