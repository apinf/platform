Template.importApiConfiguration.rendered = function () {

  var instance = this;

  instance.editor = ace.edit("editor");

  instance.editor.setTheme("ace/theme/idle_fingers");
  instance.editor.getSession().setMode("ace/mode/json");

  var tips = {
    "How_to_import_configurations": {
      "option_1" : "Upload existing config file",
      "option_2" : "Paste configurations here in JSON."
    }
  };

  instance.editor.setValue(JSON.stringify(tips, null, '\t'));

};


Template.importApiConfiguration.events({
  'dropped #dropzone': function (event, template) {

    var instance = Template.instance();

    FS.Utility.eachFile(event, function(file) {

      if (file) {

        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
          var importedFile = evt.target.result;
          var doc = jsyaml.load(importedFile);
          instance.editor.setValue(JSON.stringify(doc,  null, '\t'));
        }

      }

    });

    return false;

  },
  'submit #apiConfigurationUploadForm': function (event, template) {

    var instance = Template.instance();

    var doc = JSON.parse(instance.editor.getValue());

    Meteor.call("importApiConfigs", doc, function (err, status) {

      if (err) FlashMessages.sendError(err);

      if (status.isSuccessful) {
        FlashMessages.sendSuccess(status.message);
      }else{
        FlashMessages.sendError(status.message)
      }
    });

    return false;
  }
});

FlashMessages.configure({
  autoHide: false
});
