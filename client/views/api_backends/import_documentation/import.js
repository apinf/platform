Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event, template) {

    // Current template instance
    var instance = Template.instance();

    // Iterates through each file uploaded
    FS.Utility.eachFile(event, function(file) {

      if (file) {

        // Get file's name
        var fileName = file.name;

        // Allowed file extensions for API documentation file
        var acceptedExtensions = ["yaml", "yml", "json"];

        if (instance.stringEndsWith(fileName, acceptedExtensions)) {

          // Initialises new reader instance
          var reader = new FileReader();

          // Reads file
          reader.readAsText(file, "UTF-8");

          reader.onload = function (event) {

            // Gets file contents
            var importedFile = event.target.result;

            // Checks for correct JSON or YAML syntax in file contents
            if (JSON.parse(importedFile) || jsyaml.safeLoad(importedFile)) {

              var doc = {};

              // Checks file's extension for its secure conversion to JSON object
              if (instance.stringEndsWith(fileName, ['json'])) {

                // Converts JSON string to JSON object
                doc = JSON.parse(importedFile);
              } else if (instance.stringEndsWith(fileName, ['yaml', 'yml'])) {

                // Converts YAML string/object to JSON object
                doc = jsyaml.load(importedFile);
              }

              // Insert fine contents to a colletion
              ApiDocs.insert(doc);

            } else {

              // Notifies user if not able to parse the file either as JSON or YAML objects.
              FlashMessages.sendError("Error when reading the file. Please check file contents for errors.");

            }
          }
        } else {

          // Notifies user if file extension provided is not supported
          FlashMessages.sendError("Only .json and .yaml(.yml) files are supported.");
        }
      }
    });
  }
});

Template.importApiDocumentation.created = function () {

  // Get reference to template instance
  var instance = this;

  // Function attached to template instance checks file extension
  instance.stringEndsWith = function (filename, suffixList) {

    // Variable that keeps state of is this filename contains provided extensions - false by default
    var state = false;

    // Iterating through extensions passed into suffixList array
    for (var i=0; i <suffixList.length; i++) {

      // Parse line to check if filename contains current suffix
      var endsWith = filename.indexOf(suffixList[i], filename.length - suffixList[i].length) !== -1;

      // If current extension found in filename then change the state variable
      if (endsWith) state = true;

    }

    return state;
  };

};
