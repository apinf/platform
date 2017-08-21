// Collection imports
import ApiMetadata from '/apinf_packages/metadata/collection';
import Apis from '/apinf_packages/apis/collection';

ApiMetadata.allow({
  insert (userId, metadata) {
    const apiId = metadata.apiId;

    // Make sure there is only one document per API Backend ID
    if (ApiMetadata.find({ apiId }).count() !== 0) {
      return false;
    }
    // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanManage();
  },
  update (userId, metadata) {
    // Get API Backend ID
    const apiId = metadata.apiId;

    // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanManage();
  },
  remove (userId, metadata) {
    // Get API Backend ID
    const apiId = metadata.apiId;

    // Find related API Backend, select only "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanManage();
  },
});
