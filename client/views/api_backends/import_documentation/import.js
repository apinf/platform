Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event/*, template*/) {
    // Get the submitted file
    var file = event.target.files[0];

    // Insert into filesystem collection
    ApiDocumentation.insert(file);
  }
});
