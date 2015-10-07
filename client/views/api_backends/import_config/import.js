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
      "option_1" : "Upload existing config file.",
      "option_2" : "Paste configurations here.",
      "available_file_extensions:" : "JSON, YAML or TXT."
    }
  };

  // parses json object to string with indentation (parsing to string needed for ace editor)
  var jsonString = JSON.stringify(tips, null, '\t');

  // pastes initial value to editor
  instance.editor.setValue(jsonString);

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

          var jsonObj;

          // checks if file extension is .YAML
          if (endsWith(file.name, 'yaml') || endsWith(file.name, 'yml')) {

            // converts YAML to JSON
            var yamlToJson = jsyaml.load(importedFile);

            // parses JSON obj to JSON String with indentation
            jsonObj = JSON.stringify(yamlToJson,  null, '\t');
          }

          // checks if file extension is .JSON
          if (endsWith(file.name, 'json')) {

            // if JSON - no need to convert anything
            jsonObj = importedFile;
          }

          // checks if file extension is .TXT
          if (endsWith(file.name, 'txt')) {

          }

          // notifies user if file extention is not as expected
          if (!endsWith(file.name, 'json') && !endsWith(file.name, 'yaml') && !endsWith(file.name, 'yml')){

            FlashMessages.sendError("Config file should be .YAML, .YML or .JSON only!");

          }

          // pastes converted file to ace editor
          instance.editor.setValue(jsonObj);
        }

      }

    });

    return false;

  },
  'submit #apiConfigurationUploadForm': function (event, template) {

    // current template instance
    var instance = Template.instance();

    // gets current data from ace editor
    var jsonString = instance.editor.getValue();

    // try catch here, so that page does not reload if JSON is incorrect
    try {

      // parses JSON String to JSON Object
      var jsonObj = JSON.parse(jsonString);

      // calls method and passing jsonObj there - expects status object as callback
      Meteor.call("importApiConfigs", jsonObj, function (err, status) {

        // error handing
        if (err) FlashMessages.sendError(err);

        // checks of status is successfull`
        if (status.isSuccessful) {

          // success message
          //FlashMessages.sendSuccess(status.message);

          // redirects to apiBackend view page
          Router.go('/api/' + status.newBackendId);

        }else{

          // error message
          FlashMessages.sendError(status.message)

        }
      });

    } catch (e) {

      FlashMessages.sendError("Configuration does not look like correct JSON object.");

    }

    return false;
  }

});


// function for file extension check (since it is not provided other way)
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
