/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/settings/collection';
import Apis from '../';

Apis.allow({
  insert (userId) {
    // Get settings document
    const settings = Settings.findOne();

    try {
      // Get access setting value
      const onlyAdminsCanAddApis = settings.access.onlyAdminsCanAddApis;

      if (!onlyAdminsCanAddApis) {
        return true;
      }

      // Check if current user is admin
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // Check if current user is admin and access settings is set
      return onlyAdminsCanAddApis && userIsAdmin;
    } catch (e) {
      // If caught an error, then returning true because no access settings is set
      // By default allowing all user to add an API
      return true;
    }
  },
  update (userId, apiBackendDoc) {
    // Save ID of API Backend
    const apiBackendId = apiBackendDoc._id;
    // Get API backend with ID
    const apiBackend = Apis.findOne(apiBackendId);
    // Check if current user can edit API Backend
    const currentUserCanEdit = apiBackend.currentUserCanManage();

    if (currentUserCanEdit) {
      // User is allowed to perform action
      return true;
    }
    // User is not allowded to perform action
    return false;
  },
  remove (userId, apiBackendDoc) {
    // Save ID of API Backend
    const apiBackendId = apiBackendDoc._id;
    // Get API backend with ID
    const apiBackend = Apis.findOne(apiBackendId);
    // Check if current user can edit API Backend
    const currentUserCanEdit = apiBackend.currentUserCanManage();

    if (currentUserCanEdit) {
      // User is allowed to perform action
      return true;
    }
    // User is not allowded to perform action
    return false;
  },
});

Apis.deny({
  insert (fields) {
    // Don't allow user to set average rating or bookmark count fields
    if (_.hasIn(fields, 'averageRating') || _.hasIn(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
  update (fields) {
    // Don't allow user to set average rating or bookmark count fields
    if (_.hasIn(fields, 'averageRating') || _.hasIn(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
});
