JsonRoutes.add("get", "cfs/files/apiDocumentation/:id/:file", function (req, res, next) {

  var id = req.params.id;

  var doc = ApiDocumentation.findOne(id);
  
  JsonRoutes.sendResult(res, 200, doc );
});
