/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

function clickRateIt ({ Meteor, ApiBackendRatings, TAPi18n, sAlert, $ }) {
  if (!Meteor) return new Error('Meteor not defined');
  if (!ApiBackendRatings) return new Error('ApiBackendRatings not defined');
  if (!TAPi18n) return new Error('TAPi18n not defined');
  if (!sAlert) return new Error('sAlert not defined');
  if (!$) return new Error('jQuery not defined');

  return function (event, templateInstance) {
    if (!event) return new Error('event not defined');
    if (!templateInstance) return new Error('templateInstance not provided');
    if (!templateInstance.data) return new Error('templateInstance is invalid');

    // Make sure there is a Meteor user ID for voting
    if (Meteor.userId() === null) {
      // Get translated user message
      const message = TAPi18n.__('apiBackendRating_anonymousError');

      // Alert the user that they must log in
      sAlert.error(message);

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
  };
}

module.exports = {
  clickRateIt,
};
