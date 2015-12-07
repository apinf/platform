if (Meteor.isServer) {
  JsonRoutes.add("get", "api/:id/swagger.json", function (request, response, next) {

    // Get basePath for apiUmbrella from Meteor settings file
    var apiUmbrellaBaseUrl = Meteor.settings.apiUmbrella.baseUrl;

    // Remove trailing slash
    apiUmbrellaBaseUrl = apiUmbrellaBaseUrl.replace(/\/$/, '');

    // Parse basePath string to URI obj
    var baseURL = new URI(apiUmbrellaBaseUrl);

    // Get current id
    var id = request.params.id;

    // Fetch API Document from mongo collection
    var ApiDoc = ApiDocs.findOne(id);

    // Updates values to custom ones
    ApiDoc.host = baseURL.hostname();
    ApiDoc.basePath = baseURL.path();

    // Sends result back to client
    JsonRoutes.sendResult(response, 200, ApiDoc);
  });
}
