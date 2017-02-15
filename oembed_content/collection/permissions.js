import { Roles } from 'meteor/alanning:roles';
import Posts from './';

Posts.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
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
