import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import Posts from './';

Posts.helpers({
  isPostActionAllow () {
    let currentUserCanEdit = false;
    console.log('this=', this);
    const postEntityId = this.entityId;
    // TODO checking of entity in question
    console.log('postEntityId=', postEntityId, ' type=', this.entityType);
    if (this.entityType === '0') {
      // Check API
      const postApi = Apis.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanEdit = postApi.currentUserCanEdit();
      console.log('api ', postApi);
    } else if (this.entityType === '1') {
      // Check Organizations
      const postOrg = Organizations.findOne(postEntityId);
      // Check if current user can edit API
      currentUserCanEdit = postOrg.currentUserCanManage();
      console.log('org ', postOrg);
    }
    console.log('canedit=', currentUserCanEdit);
    if (currentUserCanEdit) {
    // User is allowed to perform action
      return true;
    }
  // User is not allowded to perform action
    return false;
  },
});
