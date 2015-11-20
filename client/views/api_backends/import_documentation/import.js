Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event/*, template*/) {

    var customProxy = "umbrella.apinf.io";
    var customBasePath = "/api-umbrella";

    // Gets selected file from the form
    var file = event.target.files[0];

    // Initialises new reader instance
    var reader = new FileReader();

    // Reads file
    reader.readAsText(file, "UTF-8");

    // When ready ..
    reader.onload = function (event) {

      // Gets file data from reader object
      var fileData = event.target.result;

      // Parses file data to JSON object, to be able to modify it
      var dataObj = JSON.parse(fileData);

      // Saving initial values of `host` and `basePath`
      dataObj.initial_host = dataObj.host;
      dataObj.initial_basePath = dataObj.basePath;

      // Updating values
      dataObj.host = customProxy;
      dataObj.basePath = customBasePath;

      var documentationFile = JSON.stringify(dataObj);

      // Creates blob object with content type of JSON
      var blobData = new Blob([documentationFile], {type: "application/json"});

      // Creates file object from Blob object
      var updatedFile = new File([blobData], file.name, {type: "application/json"});

      // Insert into filesystem collection
      ApiDocumentation.insert(updatedFile);

    };
  }
});
