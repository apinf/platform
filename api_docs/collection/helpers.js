import Apis from '/apis/collection';
import ApiDocs from './';

ApiDocs.helpers({
  isActionAllow () {
    // Get related API id
    const docApiId = this.apiId;

    if (docApiId) {
      // Get API
      const docApi = Apis.findOne(docApiId);

      if (docApi) {
        // Check if current user can edit API
        const currentUserCanEdit = docApi.currentUserCanEdit();

        if (currentUserCanEdit) {
          // User is allowed to perform action
          return true;
        }
      }
    }
    // User is not allowded to perform action
    return false;
  },
});
