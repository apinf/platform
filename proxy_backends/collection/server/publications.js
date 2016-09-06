Meteor.publish('apiProxySettings', function (apiId) {
  // Get cursor to API document, to return if user is authorized
  const apiCursor = Apis.find(apiId);

  // Get API document
  const api = apiCursor.fetch();

  // Check if user is authorized to access API proxy settings
  if (api.currentUserCanEdit()) {
    return apiCursor;
  }
});
