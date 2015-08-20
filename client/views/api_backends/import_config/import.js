Template.importApiConfiguration.rendered = function () {

  var instance = this;

  instance.editor = ace.edit("editor");

  instance.editor.setTheme("ace/theme/ambiance");
  instance.editor.getSession().setMode("ace/mode/yaml");

};


Template.importApiConfiguration.events({
  'change #apiCofigurationFile': function (event, template) {

    var instance = Template.instance();

    FS.Utility.eachFile(event, function(file) {

      if (file) {

        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {

          var importedFile = evt.target.result;
          instance.editor.setValue(importedFile);
        }

      }

      //ApiBackendConfigurations.insert(file, function (err, fileObj) {
      //  if (err){
      //    // handle error
      //    console.log(err);
      //  } else {
      //    // handle success
      //    console.log("File: ");
      //    console.log(fileObj);
      //
      //    template.reactiveFile.set(fileObj);
      //
      //  }
      //});

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

//Template.importApiConfiguration.created = function () {
//  this.reactiveFile = new ReactiveVar();
//
//};
