import Apis from '/apis/collection';
import Posts from './';

Posts.helpers({
  postsAllow (postApiId) {
    const postApi = Apis.findOne(postApiId);
  // Check if current user can edit API
    const currentUserCanEdit = postApi.currentUserCanEdit();
    if (currentUserCanEdit) {
    // User is allowed to perform action
      return true;
    }
  // User is not allowded to perform action
    return false;
  },
});
