import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import Posts from './';


Posts.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  remove (userId) {
    // User can only delete own documents
    // console.log(doc);
    // const userCanDelete = doc.userId === userId;
    // return userCanDelete;
    if (userId) {
      // Check if user is manager of this API
      const isManager = _.includes(this.managerIds, userId);
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
      if (isManager || userIsAdmin) {
        return true;
      }
    }
    return false;
  },
  update (userId) {
    if (userId) {
      // Check if user is manager of this API
      const isManager = _.includes(this.managerIds, userId);
      console.log('manager', userId);
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
      if (isManager || userIsAdmin) {
        return true;
      }
    }
    // return api.currentUserCanManage;
    // User can only change own documents
    // console.log(doc);
    // const userCanModify = doc.userId === userId;
    // return userCanModify;
    return false;
  },
});
