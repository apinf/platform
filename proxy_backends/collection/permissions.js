// Apinf import
import { ProxyBackends } from './';

ProxyBackends.allow({
  insert () {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(this.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  update () {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(this.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
  remove () {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(this.apiId);

    // Check if current user can edit API
    if (api && api.currentUserCanEdit()) {
      return true;
    }
  },
});
