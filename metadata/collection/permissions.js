// Collection imports
import ApiMetadata from '/metadata/collection';
import Apis from '/apis/collection';

ApiMetadata.allow({
  insert (userId, metadata) {
    const apiId = metadata.apiBackendId;

    // Make sure there is only one document per API Backend ID
    // TODO: refactor ApiMetadata schema to use 'apiId' field
    if (ApiMetadata.find({ apiBackendId: apiId }).count() !== 0) {
      console.log('no insert allowed');
      return false;
    }
      // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

      // Check if current user can edit API Backend
    const userCanEdit = api.currentUserCanEdit();

    return userCanEdit;
  },
  update (userId, metadata) {
    // Get API Backend ID
    const apiId = metadata.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanEdit();
  },
  remove (userId, metadata) {
    // Get API Backend ID
    const apiId = metadata.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanEdit();
  },
});
