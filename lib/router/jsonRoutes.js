JsonRoutes.add("get", "files/apiDocumentation/:id", function (req, res, next) {

  var id = req.params.id;

  var ApiDoc = ApiDocs.findOne(id);

  JsonRoutes.sendResult(res, 200, ApiDoc);
});
