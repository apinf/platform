Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {

    FS.Utility.eachFile(event, function(file) {

      ApiBackendConfigurations.insert(file, function (err, fileObj) {
        if (err){
          // handle error
          console.log(err);
        } else {
          // handle success
          console.log("File: ");
          console.log(fileObj);

          template.reactiveFile.set(fileObj);

        }
      });

    });

    return false;

  },
  'submit #apiConfigurationUploadForm': function (event, template) {

    var fileObj = template.reactiveFile.get();
    var fileId  = fileObj._id;

    Meteor.call("convertYamlToJson", fileId, function (err, file) {
      if (err) console.log(err);
      console.log(file);
    });

    return false;
  }
});

Template.importApiConfiguration.created = function () {
  this.reactiveFile = new ReactiveVar();
};
