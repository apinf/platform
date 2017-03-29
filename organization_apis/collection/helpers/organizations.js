/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
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
    // Get ids of managed APIs of organization
    const apiIds = this.managedApiIds();
    const userId = Meteor.userId();
    // Placeholder for storage database query
    let filteredApis;

    if (this.currentUserCanManage()) {
      filteredApis = { _id: { $in: apiIds } };
    } else {
      // Case: Registered users
      if (userId) {
        // Case: user is manager of APIs or without APIs
        // Select available organization apis for current user
        filteredApis = {
          _id: { $in: apiIds },
          $or: [
            { isPublic: true },
            { managerIds: userId },
            { authorizedUserIds: userId },
          ],
        };
      } else {
        // Case: Anonymous users

        // Show all public apis of organization
        filteredApis = { _id: { $in: apiIds }, isPublic: true };
      }
    }

    return filteredApis;
  },
});
