Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event/*, template*/) {

    // Gets selected file from the form
    var file = event.target.files[0];

    // Insert into filesystem collection
    ApiDocumentation.insert(file);
  }
});
