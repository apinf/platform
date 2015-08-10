Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {

    // Get the submitted file
    var file = event.target.files[0];

    // setting submitted file to a reactive variable, to have access to it from other helper within current template
    template.reactiveFile.set(file);

    // Insert into filesystem collection
    ApiBackendConfigurations.insert(file);

  }
});

Template.importApiConfiguration.created = function () {

  // initializing a new reactive variable and "attaching" it to current template
  this.reactiveFile = new ReactiveVar();
};
