JsonRoutes.add("get", "files/apiDoc/:id", function (req, res, next) {

  // New value for custom Proxy TODO: move host & basePath values to some kind of config file
  var customHost = "umbrella.apinf.io";
  var customBasePath = "/api-umbrella";

  var id = req.params.id;

  var ApiDoc = ApiDocs.findOne(id);

  // Updates values to custom ones
  ApiDoc.host = customHost;
  ApiDoc.basePath = customBasePath;

  // Sends result back to client
  JsonRoutes.sendResult(res, 200, ApiDoc);
});
