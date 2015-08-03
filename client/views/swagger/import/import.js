Template.importSwaggerConfiguration.events({
  'change #swaggerCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    // Insert into filesystem collection
    var insertedFile = SwaggerBackendConfigurations.insert(file);
    console.log(insertedFile);
  }
})
