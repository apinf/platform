JsonRoutes.add("get", "files/apiDocumentation/:id", function (req, res, next) {

  var customHost = "umbrella.apinf.io";
  var customBasePath = "/api-umbrella";

  var id = req.params.id;

  var ApiDoc = ApiDocs.findOne(id);

  ApiDoc.host = customHost;
  ApiDoc.basePath = customBasePath;

  JsonRoutes.sendResult(res, 200, ApiDoc);
});
