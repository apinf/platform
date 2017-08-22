/* Copyright 2017 Apinf Oy
-This file is covered by the EUPL license.
-You may obtain a copy of the licence at
-https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection';

Template.apiCardPin.events({
  'click .pin-button': function (event, templateInstance) {
    const organizationId = templateInstance.data.organization._id;
    const featuredApiId = templateInstance.data.api._id;
    const featuredApiList = templateInstance.data.organization.featuredApiIds;

    // Check what can be done for API card in question
    if (Organizations.findOne({ featuredApiIds: featuredApiId })) {
      // if the API was already featured, remove it from featured list
      Organizations.update({ _id: organizationId },
        { $pull:
          { featuredApiIds: featuredApiId },
        }
      );
      // Get localized success message
      const message = TAPi18n.__('apiCardPin_unfeaturedSuccessfully');

      // Display success message to user
      sAlert.success(message);
    } else if (!featuredApiList || featuredApiList.length < 4) {
      // If there is room in featured list, add API there
      Organizations.update({ _id: organizationId },
        { $push:
          { featuredApiIds: featuredApiId },
        }
      );
      // Get localized success message
      const message = TAPi18n.__('apiCardPin_featuredSuccessfully');

      // Display success message to user
      sAlert.success(message);
    } else {
      // There is no room in featured list, API can not be added
      // Get localized error message
      const message = TAPi18n.__('apiCardPin_featuredListAlreadyFull');

        // Display success message to user
      sAlert.error(message);
    }
  },
});

Template.apiCardPin.helpers({
  apiIsFeatured () {
    // Check if API in question is in Organization's featured list
    const instance = this;
    const featuredApiId = instance.api._id;

    if (Organizations.findOne({ featuredApiIds: featuredApiId })) {
      // API was found
      return true;
    }
    return false;
  },
});
