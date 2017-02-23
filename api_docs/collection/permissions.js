import ApiDocs from './';

ApiDocs.allow({
  insert (userId) {
    // Check if user is registered
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
  update (userId) {
    // Check if user is registered
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
  remove (userId) {
    // Check if user is registered
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
});
