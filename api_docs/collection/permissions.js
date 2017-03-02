import ApiDocs from './';

ApiDocs.allow({
  insert (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
  remove (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
  update (userId, apiDocs) {
    return apiDocs.currentUserCanEdit();
  },
});
