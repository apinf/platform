// Collection imports
import Apis from '/apis/collection';
import ProxyBackends from './';

ProxyBackends.allow({
  insert (userId, backend) {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanEdit());
  },
  update (userId, backend) {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanEdit());
  },
  remove (userId, backend) {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanEdit());
  },
});
