import { Posts } from './';

Posts.allow({
  insert () {
    if (Meteor.user()){
      return true;
    }
  },
  remove: function (userId, doc) {
    // User can only delete own documents
    userCanDelete = doc.userId === userId;
    return userCanDelete;
  },
  update: function (userId, doc, fields, modifier) {
    // User can only change own documents
    userCanModify = doc.userId === userId;
    return userCanModify;
  },
});
