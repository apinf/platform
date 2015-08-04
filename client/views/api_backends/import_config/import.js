Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    // Insert into filesystem collection
    var insertedFile = ApiBackendConfigurations.insert(file);
    console.log(insertedFile);
  }
})
