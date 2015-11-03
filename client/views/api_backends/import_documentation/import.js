Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event/*, template*/) {

    var customProxy = "umbrella.apinf.io";
    var customBasePath = "/api-umbrella";

    // Get the submitted file
    var file = event.target.files[0];

    var reader = new FileReader();
    
    reader.readAsText(file, "UTF-8");

    // Insert into filesystem collection
    ApiDocumentation.insert(file);
  }
});
