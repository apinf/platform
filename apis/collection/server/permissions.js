import _ from 'lodash';
import { Apis } from '../';

Apis.allow({
  insert (userId, apiBackendDoc) {
    return true;
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
    if (_.contains(fields, 'averageRating') || _.contains(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
  update (fields) {
    // Don't allow user to set average rating or bookmark count fields
    if (_.contains(fields, 'averageRating') || _.contains(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
});
