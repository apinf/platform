import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import Posts from './';

Posts.helpers({
  isPostActionAllow () {
    const postEntityId = this.apiId;
    // TODO checking of entity in question
    // if (api) {
    // Check API
    const postApi = Apis.findOne(postEntityId);
  // Check if current user can edit API
    const currentUserCanEdit = postApi.currentUserCanEdit();
    // }
    // else {
    // Check Organizations
    const postOrg = Organizatons.findOne(postEntityId);
  // Check if current user can edit API
    const currentUserCanEdit = postOrg.currentUserCanManage();
    // }
    if (currentUserCanEdit) {
    // User is allowed to perform action
      return true;
    }
  // User is not allowded to perform action
    return false;
  },
});
