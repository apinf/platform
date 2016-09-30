// APINF import
import { Monitoring } from './';
import { Apis } from '/apis/collection';

Monitoring.allow({
  insert (userId, data) {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  update (userId, data) {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  remove (userId, data) {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
});
