import { ApiLogo } from '/apis/logo/collection/collection';

ApiLogo.allow({
  insert: function(userId, file) {
    return true;
  },
  remove: function(userId, file) {
    return true;
  },
  read: function(userId, file) {
    return true;
  },
  write: function(userId, file, fields) {
    return true;
  }
});
