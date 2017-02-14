import { Roles } from 'meteor/alanning:roles';
import Posts from './';

Posts.allow({
  insert (userId) {
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
    if (userIsAdmin) {
      return true;
    }
    return false;
  },
  remove (userId, doc) {
    // User can only delete own documents
    const userCanDelete = doc.userId === userId;
    return userCanDelete;
  },
  update (userId, doc) {
    // User can only change own documents
    const userCanModify = doc.userId === userId;
    return userCanModify;
  },
});
