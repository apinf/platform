Template.importApiConfiguration.rendered = function () {
  // keep current template instance
  const instance = this;

  // initialises ace editor
  instance.editor = ace.edit('editor');

  // theme for editor
  instance.editor.setTheme('ace/theme/idle_fingers');

  // code highlights for editor (JSON)
  instance.editor.getSession().setMode('ace/mode/json');

  // custom message (tutorial) in json format
  const tips = {
    'How_to_import_configurations': {
      'option_1': 'Upload existing config file.',
      'option_2': 'Paste configurations here.',
      'available_file_extensions:': 'JSON, YAML or TXT.',
    },
  };

  // parses json object to string with indentation (parsing to string needed for ace editor)
  const jsonString = JSON.stringify(tips, null, '\t');

  // pastes initial value to editor
  instance.editor.setValue(jsonString);
};


// Get reference to template instance
Template.importApiConfiguration.created = function () {
  const instance = this;

  // function attached to template instance checks file extension
  instance.endsWith = function (filename, suffixList) {
    // variable that keeps state of is this filename contains provided extensions - false by default
    let state = false;

    // iterating through extensions passed into suffixList array
    for (let i = 0; i < suffixList.length; i++) {
      // parses line to check if filename contains current suffix
      const endsWith = filename.indexOf(suffixList[i], filename.length - suffixList[i].length) !== -1;

      // if current extension found in filename then change the state variable
      if (endsWith) state = true;
    }

    return state;
  };
};


Template.importApiConfiguration.events({
  'dropped #dropzone': function (event, template) {
    // current template instance
    const instance = Template.instance();

    // grabs "dropped" files and iterates through them
    FS.Utility.eachFile(event, function (file) {
      // checks if file is found
      if (file) {
        // initialises new reader instance
        const reader = new FileReader();

        // reads file - expecting YAML, JSON or TXT
        reader.readAsText(file, 'UTF-8');

        // once file is loaded, doing smth with it
        reader.onload = function (event) {
          // gets file contents
          const importedFile = event.target.result;

          let jsonObj = {};

          const acceptedExtensions = ['yaml', 'yml', 'txt', 'json'];

          // checks if file name contains one of accepted extensions
          if (instance.endsWith(file.name, acceptedExtensions)) {
            // checks if file extension is .YAML or .TXT
            if (instance.endsWith(file.name, ['yaml', 'yml', 'txt'])) {
              // converts YAML to JSON
              const yamlToJson = jsyaml.load(importedFile);

              // parses JSON obj to JSON String with indentation
              jsonObj = JSON.stringify(yamlToJson, null, '\t');
            }

            // checks if file extension is .JSON
            if (instance.endsWith(file.name, ['json'])) {
              // if JSON - no need to convert anything
              jsonObj = importedFile;
            }
          } else {
            // Get error message translation
            const message = TAPi18n.__('importApiConfiguration_errorMessage');

            // notifies user if file extension is not as expected
            sAlert.error(message);
          }

          // pastes converted file to ace editor
          instance.editor.setValue(jsonObj);
        };
      }
    });

    return false;
  },
  'submit #apiConfigurationUploadForm': function (event, template) {
    // current template instance
    const instance = Template.instance();

    // gets current data from ace editor
    const jsonString = instance.editor.getValue();

    // try catch here, so that page does not reload if JSON is incorrect
    try {
      // parses JSON String to JSON Object
      const jsonObj = JSON.parse(jsonString);

      // calls method and passing jsonObj there - expects status object as callback
      Meteor.call('importApiConfigs', jsonObj, function (err, status) {
        // error handing
        if (err) sAlert.error(err);

        // checks of status is successfull`
        if (status.isSuccessful) {
          // success message
          sAlert.success(status.message);

          // redirects to apiBackend view page
          Router.go('/api/' + status.newBackendId);
        } else {
          // error message
          sAlert.error(status.message);
        }
      });
    } catch (e) {
      // Get translated error message
      const message = TAPi18n.__('importApiConfiguration_jsonError_message');

      // Alert user of error
      sAlert.error(message);
    }

    return false;
  },

});
