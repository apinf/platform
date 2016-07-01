import ss from 'simple-statistics';
import moment from 'moment';
import { ApiBackends } from '/apis/collection/backend';
import lodash from 'lodash';

ApiBackends.helpers({
  getAverageRating () {
    // Fetch all ratings
    var apiBackendRatings = ApiBackendRatings.find({
      apiBackendId: this._id
    }).fetch();

    // If ratings exist
    if (apiBackendRatings) {
      // Create array containing only rating values
      var apiBackendRatingsArray = _.map(apiBackendRatings, function (rating) {
        // get only the rating value; omit User ID and API Backend ID fields
        return rating.rating;
      });

      // Get the average (mean) value for API Backend ratings
      var apiBackendRatingsAverage = ss.mean(apiBackendRatingsArray);
      // Return average with precision of 2 significant numbers
      const result = Number(apiBackendRatingsAverage.toPrecision(2));
      if( !isNaN(result) ) {
        return Number(apiBackendRatingsAverage.toPrecision(2));
      } else {
        return false;
      }
    }
  },
  setAverageRating () {
    // get average rating value
    const averageRating = this.getAverageRating();

    // Check if average rating calculation succeeds
    if (averageRating) {
      // Update the API Backend with average rating value
      ApiBackends.update(this._id, {$set: {averageRating}});
    }
  },
  getBookmarkCount () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get count of API Bookmarks where API Backend ID is in API Backend IDs array
    const apiBookmarkCount = ApiBookmarks.find({apiIds: apiBackendId}).count();

    return apiBookmarkCount;
  },
  setBookmarkCount () {
    // get average rating value
    const bookmarkCount = this.getBookmarkCount();

    // Check if average rating calculation succeeds
    if (bookmarkCount) {
      // Update the API Backend with average rating value
      ApiBackends.update(this._id, {$set: {bookmarkCount}});
    } else {
      ApiBackends.update(this._id, {$unset: {bookmarkCount: ""}})
    }
  },
  getRating () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get current user ID
    const userId = Meteor.userId();

    // Check if user is logged in
    if (Meteor.userId()) {
      // Check if user has rated API Backend
      var userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId
      });

      if (userRating) {
        return userRating.rating;
      }
    }

    // Otherwise, get average rating
    return this.averageRating;
  },
  currentUserCanEdit () {
    // Get current userId
    var userId = Meteor.userId();

    // Check that user is logged in
    if( userId ) {
      // Check if user is API manager
      var isManager = _.has(this.managerIds, userId);

      if (isManager) {
        return true;
      }

      // Check if user is administrator
      var isAdmin = Roles.userIsInRole(userId, ['admin']);

      if (isAdmin) {
        return true;
      }
    } else {
      // User is not logged in
      return false;
    }
  },
  currentUserIsManager () {
    // Get current User ID
    var userId = Meteor.userId();

    // Get Manager IDs array from API Backend document
    var managerIds = this.managerIds;

    // Check if User ID is in Manager IDs array
    var isManager = _.contains(managerIds, userId);

    return isManager;
  },
  getApiManagersByName () {
    // Get Manager IDs array from API Backend document
    const managerIds = this.managerIds;

    // Create API managers array with usernames
    const apiManagers = _.map(managerIds, function(id) {
      let userById;
      if(id) {
        userById = Meteor.users.findOne(id);
        if(userById && userById.username) {
          // Return username of manager
          return userById.username;
        }
      } else {
        // If array has null return admin
        return 'admin';
      }
    });

    return apiManagers;
  },
  relativeUpdatedAt () {
    // Return relative updated_at
    return moment(this.updated_at).fromNow();
  },
  relativeCreatedAt () {
    // Return relative updated_at
    return moment(this.created_at).fromNow();
  }
});
