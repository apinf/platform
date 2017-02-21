import Apis from '/apis/collection';
import Posts from './';

Posts.allow({
  insert (userId, post) {
    const postApiId = post.apiId;
    // Get API owning current post
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
  remove (userId, post) {
    const postApiId = post.apiId;
    // Get API owning current post
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
  update (userId, post) {
    const postApiId = post.apiId;
    // Get API owning current post
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
