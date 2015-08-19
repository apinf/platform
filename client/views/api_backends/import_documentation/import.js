Template.importdocumentationConfiguration.events({
  'change #documentationCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    // Insert into filesystem collection
    var insertedFile = documentationBackendConfigurations.insert(file);
    console.log(insertedFile);
  }
})
