Template.importApiConfiguration.rendered = function () {

  // keep current template instance
  var instance = this;

  // initialises ace editor
  instance.editor = ace.edit("editor");

  // theme for editor
  instance.editor.setTheme("ace/theme/idle_fingers");

  // code highlights for editor (JSON)
  instance.editor.getSession().setMode("ace/mode/json");

  // custom message (tutorial) in json format
  var tips = {
    "How_to_import_configurations": {
      "option_1" : "Upload existing config file",
      "option_2" : "Paste configurations here in JSON."
    }
  };

  // parses json object to string with indentation (parsing to string needed for ace editor)
  var jsonString = JSON.stringify(tips, null, '\t');

  // pastes initial value to editor
  instance.editor.setValue();

};


Template.importApiConfiguration.events({
  'dropped #dropzone': function (event, template) {

    // current template instance
    var instance = Template.instance();

    // grabs "dropped" files and iterates through them
    FS.Utility.eachFile(event, function(file) {

      // checks if file is found
      if (file) {

        // initialises new reader instance
        var reader = new FileReader();

        // reads file - expecting YAML, JSON or TXT
        reader.readAsText(file, "UTF-8");

        // once file is loaded, doing smth with it
        reader.onload = function (event) {

          // gets file contents
          var importedFile = event.target.result;

          // converts YAML to JSON
          var doc = jsyaml.load(importedFile);

          // parses JSON obj to JSON String with indentation
          var jsonString = JSON.stringify(doc,  null, '\t');

          // pastes converted file to ace editor
          instance.editor.setValue(jsonString);
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
