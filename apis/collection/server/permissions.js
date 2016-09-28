import _ from 'lodash';

import { Roles } from 'meteor/alanning:roles';

import { Settings } from '/settings/collection';
import { Apis } from '../';

Apis.allow({
  insert (userId) {
    // Get settings document
    const settings = Settings.findOne();

    try {
      // Get access setting value
      const onlyAdminsCanAddApi = settings.access.onlyAdminsCanAddApi;

      if (!onlyAdminsCanAddApi) {
        return true;
      }

      // Check if current user is admin
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // Check if current user is admin and access settings is set
      return onlyAdminsCanAddApi && userIsAdmin;
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
    const currentUserCanEdit = apiBackend.currentUserCanEdit();

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
    const currentUserCanEdit = apiBackend.currentUserCanEdit();

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
