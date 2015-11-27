JsonRoutes.add("get", "api/:id/swagger.json", function (request, response, next) {

  var apiUmbrellaBaseUrl = Meteor.settings.apiUmbrella.baseUrl;

  var baseURL = new URI(apiUmbrellaBaseUrl);

  var id = request.params.id;

  var ApiDoc = ApiDocs.findOne(id);

  // Updates values to custom ones
  ApiDoc.host = baseURL.hostname();
  ApiDoc.basePath = baseURL.path();

  // Sends result back to client
  JsonRoutes.sendResult(response, 200, ApiDoc);
});
