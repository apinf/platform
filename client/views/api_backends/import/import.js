Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    // Insert into filesystem collection
    var insertedFile = ApiBackendConfigurations.insert(file);

    // Converting YAML file to JSON
    if(insertedFile){
      Meteor.call("convertYamlToJson", file.name, function (err, file) {
        if (err) console.log(err);
        console.log(file);
      });
    }

  }
});
