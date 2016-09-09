// Collection imports
import { ApiBackendRatings } from '../collection';
import { Apis } from '/apis/collection';

Template.apiBackendRating.created = function () {
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
};

Template.apiBackendRating.rendered = function () {
  // Get reference to template instance
  const instance = this;

  // Get API Backend ID from template instance
  const apiBackendId = instance.data._id;

  // get API Backend document
  const apiBackend = Apis.findOne(apiBackendId);

  instance.autorun(function () {
    // Make sure API Backend Rating subscription is ready
    if (instance.apiRatingSubscription.ready()) {
      // Check if user has previously rated API Backend
      const userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId: Meteor.userId(),
      });

      // Add the jQuery RateIt widget
      $('#rating-' + apiBackendId).rateit({
        max: 4,
        step: 1,
        resetable: false,
        // Only logged in user can rate
        readonly: Meteor.userId() ? false : true,
        // use previous rating, if exists
        value: userRating ? userRating.rating : apiBackend.averageRating,
      });
    }
  });
};

Template.apiBackendRating.events({
  'click .rateit': function (event, instance) {
    // Make sure there is a Meteor user ID for voting
    if (Meteor.userId() === null) {
      // Get translated user message
      const userMessage = TAPi18n.__('api-backend-rating-anonymous');

      // Alert the user that they must log in
      sAlert.error(userMessage);

      return false;
    }

    // Get API Backend ID from template data context
    const apiBackendId = instance.data._id;

    // Get rating from template based on API Backend ID
    const rating = $('#rating-' + apiBackendId).rateit('value');

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
    Meteor.call('setApiBackendAverageRating', apiBackendId);
  },
});

Template.apiBackendRating.helpers({
  'userRatingClass': function () {
    // Get reference to template instance
    const instance = Template.instance();

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
        return 'user-own-rating';
      }
    }
  },
  'ratingCount': function () {
    // Get reference to template instance
    const instance = Template.instance();

    // Make sure API Ratings subscription is ready
    if (instance.apiRatingSubscription.ready()) {
      // Get API Backend ID
      const apiBackendId = instance.data._id;

      // Get all ratings for current API Backend
      const apiBackendRatings = ApiBackendRatings.find({ apiBackendId });

      // Get the count of API Backend ratings
      const apiBackendRatingsCount = apiBackendRatings.count();

      return apiBackendRatingsCount;
    }
  },
  'userHasRating': function () {
    // Get reference to template instance
    const instance = Template.instance();

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
        return true;
      } else {
        return false;
      }
    }
  },
});
