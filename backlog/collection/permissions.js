// Collection imports
import Apis from '/apis/collection';
import ApiBacklogItems from './';

ApiBacklogItems.allow({
  insert (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  update (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  remove (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
});
