import ApiDocs from './';

ApiDocs.allow({
  insert (userId, apiDocs) {
    return apiDocs.isActionAllow();
  },
  remove (userId, apiDocs) {
    return apiDocs.isActionAllow();
  },
  update (userId, apiDocs) {
    return apiDocs.isActionAllow();
  },
});
