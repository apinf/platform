// Apinf import
import { ProxyBackends } from './';
import Apis from '/apis/collection';

ProxyBackends.allow({
  insert (userId, backend) {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  update (userId, backend) {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  remove (userId, backend) {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
});
