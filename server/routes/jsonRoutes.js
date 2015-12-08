JsonRoutes.add("get", "api/:id/swagger.json", function (request, response, next) {

  // Get current id
  var id = request.params.id;

  // Get basePath for apiUmbrella from Meteor settings file
  var apiUmbrellaBaseUrl = Meteor.settings.apiUmbrella.baseUrl;

  // Parse basePath string to URI obj
  var baseURL = new URI(apiUmbrellaBaseUrl);

  // Fetch API Document from mongo collection
  var apiDoc = ApiDocs.findOne(id);

  var apiBackendId = apiDoc.apiBackendId;

  var apiBackend = ApiBackends.findOne(apiBackendId);

  var urlPrefix = apiBackend.url_matches[0].frontend_prefix;

  // Updates values to custom ones
  apiDoc.host = baseURL.hostname();
  apiDoc.basePath = urlPrefix;

  // Sends result back to client
  JsonRoutes.sendResult(response, 200, apiDoc);
});
