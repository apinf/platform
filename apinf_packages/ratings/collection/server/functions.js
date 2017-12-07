/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

function publishMyApiBackendRating ({ check, ApiBackendRatings, context }) {
  return function (apiBackendId) {
    // Make sure apiBackendId is a String
    check(apiBackendId, String);

    // get current user ID
    const userId = this.userId;

    // get user API Backend rating
    const userApiBackendRatings = ApiBackendRatings.find({
      userId,
      apiBackendId,
    });

    return userApiBackendRatings;
  }.bind(context);
}

function publishMyApiBackendRatings ({ ApiBackendRatings, context }) {
  return function () {
    // get current user ID
    const userId = this.userId;

    // get user API Backend ratings
    const userApiBackendRatings = ApiBackendRatings.find({ userId });

    return userApiBackendRatings;
  }.bind(context);
}

function publishApiBackendRatings ({ check, ApiBackendRatings }) {
  return function (apiBackendId) {
    // Make sure apiBackendId is a String
    check(apiBackendId, String);

    // get API Backend Ratings, excluding the User ID field
    const apiBackendRatings = ApiBackendRatings.find(
      { apiBackendId }
    );

    return apiBackendRatings;
  };
}

module.exports = {
  publishMyApiBackendRating,
  publishMyApiBackendRatings,
  publishApiBackendRatings,
};
