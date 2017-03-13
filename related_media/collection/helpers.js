import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import Posts from './';

Posts.helpers({
  isPostActionAllow () {
    let currentUserCanManage = false;
    const postEntityId = this.entityId;
    // TODO checking of entity in question
    if (this.entityType === 0) {
      // Check API
      const postApi = Apis.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanManage = postApi.currentUserCanManage();
    } else if (this.entityType === 1) {
      // Check Organizations
      const postOrg = Organizations.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanManage = postOrg.currentUserCanManage();
    }
    if (currentUserCanManage) {
    // User is allowed to perform action
      return true;
    }
  // User is not allowded to perform action
    return false;
  },
});
