Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {
    // Get the submitted file
    var file = event.target.files[0];

    template.reactiveFile.set(file);

    // Insert into filesystem collection
    var insertedFile = ApiBackendConfigurations.insert(file);
    console.log(insertedFile)
  },
  'submit #apiConfigurationUploadForm': function (event, template) {
    Meteor.call("convertYamlToJson", template.reactiveFile.get().name, function (err, file) {
      if (err) console.log(err);
      console.log(file);
    });

    return false;
  }
});

Template.importApiConfiguration.created = function () {
  this.reactiveFile = new ReactiveVar();
};
