Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event/*, template*/) {

    var customProxy = "umbrella.apinf.io";
    var customBasePath = "/api-umbrella";

    // Get the submitted file
    var file = event.target.files[0];

    var reader = new FileReader();

    reader.readAsText(file, "UTF-8");

    reader.onload = function (event) {

      var fileData = event.target.result;

      var dataObj = JSON.parse(fileData);

      dataObj.host = customProxy;

      dataObj.basePath = customBasePath;

      var documentationFile = JSON.stringify(dataObj);

      var blobData = new Blob([documentationFile], {type: "application/json"});

    };

    // Insert into filesystem collection
    ApiDocumentation.insert(file);
  }
});
