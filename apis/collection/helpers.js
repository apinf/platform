// Utility imports
import ss from 'simple-statistics';
import moment from 'moment';
import _ from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
// Collection imports
import { ApiBackendRatings } from '/ratings/collection';
import { ApiBookmarks } from '/bookmarks/collection';
import { Apis } from './';

Apis.helpers({
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // Check that user is logged in
    if (userId) {
      // Check if user is manager of this API
      const userIsManager = _.includes(this.managerIds, userId);

      // Check if user has external access
      const userIsAuthorized = _.includes(this.authorizedUserIds, userId);

      // Check if user is administrator
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // if user is manager or administrator, they can edit
      if (userIsManager || userIsAuthorized || userIsAdmin) {
        return true;
      }
    }
    // User is not logged in
    return false;
  },
  currentUserCanView () {
    // Check if API is public
    // Only user who can edit, can view private APIs
    return (this.visibility === 'public' || this.currentUserCanEdit());
  },
  currentUserIsManager () {
    // Get current User ID
    const userId = Meteor.userId();

    // Check if user is manager of this API
    const isManager = _.includes(this.managerIds, userId);

    return isManager;
  },
  getApiManagersByName () {
    // Get Manager IDs array from API Backend document
    const managerIds = this.managerIds;

    // Create API managers array with usernames
    const apiManagers = _.map(managerIds, (id) => {
      let userById;
      if (id) {
        userById = Meteor.users.findOne(id);
        if (userById && userById.username) {
          // Return username of manager
          return userById.username;
        }
      }
      // If array has null return admin
      return 'admin';
    });

    return apiManagers;
  },
  getAverageRating () {
    // Fetch all ratings
    const apiBackendRatings = ApiBackendRatings.find({
      apiBackendId: this._id,
    }).fetch();

    // If ratings exist
    if (apiBackendRatings) {
      // Create array containing only rating values
      // get only the rating value; omit User ID and API Backend ID fields
      const apiBackendRatingsArray = _.map(apiBackendRatings, rating => rating.rating);

      // Get the average (mean) value for API Backend ratings
      const apiBackendRatingsAverage = ss.mean(apiBackendRatingsArray);
      // Return average with precision of 2 significant numbers
      const result = Number(apiBackendRatingsAverage.toPrecision(2));

      if (!isNaN(result)) {
        return Number(apiBackendRatingsAverage.toPrecision(2));
      }
    }

    return false;
  },
  getBookmarkCount () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get count of API Bookmarks where API Backend ID is in API Backend IDs array
    const apiBookmarkCount = ApiBookmarks.find({ apiIds: apiBackendId }).count();

    return apiBookmarkCount || '0';
  },
  getRating () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get current user ID
    const userId = Meteor.userId();

    // Check if user is logged in
    if (Meteor.userId()) {
      // Check if user has rated API Backend
      const userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId,
      });

      if (userRating) {
        return userRating.rating;
      }
    }

    // Otherwise, get average rating
    return this.averageRating;
  },
  relativeUpdatedAt () {
    // Return relative updated_at
    return moment(this.updated_at).fromNow();
  },
  relativeCreatedAt () {
    // Return relative updated_at
    return moment(this.created_at).fromNow();
  },
  setAverageRating () {
    // get average rating value
    const averageRating = this.getAverageRating();

    // Check if average rating calculation succeeds
    if (averageRating) {
      // Update the API Backend with average rating value
      Apis.update(this._id, { $set: { averageRating } });
    }
  },
  setBookmarkCount () {
    // get average rating value
    const bookmarkCount = this.getBookmarkCount();

    // Check if average rating calculation succeeds
    if (bookmarkCount) {
      // Update the API Backend with average rating value
      Apis.update(this._id, { $set: { bookmarkCount } });
    } else {
      Apis.update(this._id, { $unset: { bookmarkCount: '' } });
    }
  },
});
