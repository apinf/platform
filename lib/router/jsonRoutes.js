JsonRoutes.add("get", "files/apiDoc/:id", function (req, res, next) {

  var baseURL = Meteor.settings.api_umbrella.base_url;
  
  var clearedValues = baseURL.replace('https://','');
  var splittedValues = clearedValues.split('/');
  var customHost = splittedValues[0];
  var customBasePath = '/' + splittedValues[1];

  var id = req.params.id;

  var ApiDoc = ApiDocs.findOne(id);

  // Updates values to custom ones
  ApiDoc.host = customHost;
  ApiDoc.basePath = customBasePath;

  // Sends result back to client
  JsonRoutes.sendResult(res, 200, ApiDoc);
});
