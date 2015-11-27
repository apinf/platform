JsonRoutes.add("get", "files/apiDoc/:id", function (req, res, next) {

  var baseURL = Meteor.settings.apiUmbrella.baseUrl;

  var clearedString = "";

  // Checks what protocol is in the string and removes one from a string
  if(baseURL.indexOf('https://') >= 0){

    clearedString = baseURL.replace('https://','');

  } else if (baseURL.indexOf('http://') >= 0){

    clearedString = baseURL.replace('http://','');
  }

  var splittedValues = clearedString.split('/');
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
