/* Copyright 2017 Apinf Oy
-This file is covered by the EUPL license.
-You may obtain a copy of the licence at
-https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Organizations from '/organizations/collection';

Template.apiCardPin.events({
  'click .pin-button': function () {
    const instance = this;
    const organizationId = instance.organization._id;
    const featuredApiId = instance.api._id;
    const featuredApiList = instance.organization.featuredApiIds;
    // If API was already featured, remove it from featured list
    if (Organizations.find({ featuredApiIds: featuredApiId }).count() > 0) {
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
        // Get localized error message
      const message = TAPi18n.__('apiCardPin_featuredListAlreadyFull');

        // Display success message to user
      sAlert.error(message);
    }
  },
});

Template.apiCardPin.helpers({
  isFeatured () {
    const instance = this;
    const featuredApiId = instance.api._id;
    // If API was already featured, remove it from featured list
    if (Organizations.find({ featuredApiIds: featuredApiId }).count() > 0) {
      return 1;
    }
    return 0;
  },
});
