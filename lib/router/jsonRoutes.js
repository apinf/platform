JsonRoutes.add("get", "api/:id/swagger.json", function (request, response, next) {
  // Get basePath for apiUmbrella from Meteor settings file
  var baseUrl = new URI(Meteor.settings.apiUmbrella.baseUrl);

  // Get current id
  var id = request.params.id;

  // Fetch API Document from mongo collection
  var ApiDoc = ApiDocs.findOne(id);

  // Updates values to custom ones
  ApiDoc.host = baseUrl.hostname();
  ApiDoc.basePath = baseUrl.directory();

  // Sends result back to client
  JsonRoutes.sendResult(response, 200, ApiDoc);
});
