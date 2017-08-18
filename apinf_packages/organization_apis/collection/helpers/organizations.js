/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection';
import OrganizationApis from '../';

Organizations.helpers({
  managedApiIds () {
    // Get organizationApis document, which joins organizations with APIs
    const organizationApiLinks = OrganizationApis.find({ organizationId: this._id }).fetch();

    // Make sure organization has APIs
    if (organizationApiLinks) {
      //   Get an array of API IDs
      return _.map(organizationApiLinks, (organizationApiLink) => {
        // Return API ID for current organizaiton-api link
        return organizationApiLink.apiId;
      });
    }
    // Return empty array because organization doesn't have APIs
    return [];
  },
  userVisibleApiFilter () {
    const userId = Meteor.userId();
    // Placeholder for storage database query
    let filteredApis;

    // If user is organization manager
    if (this.currentUserCanManage()) {
      // Then all managed APIs are available
      filteredApis = {};
    } else if (userId) {
      // Case: user manages API, or has authorization, or API is public.
      filteredApis = {
        $or: [
          { isPublic: true },
          { managerIds: userId },
          { authorizedUserIds: userId },
        ],
      };
    } else {
      // Show all public APIs of organization for anonymous user
      filteredApis = { isPublic: true };
    }

    return filteredApis;
  },
});
