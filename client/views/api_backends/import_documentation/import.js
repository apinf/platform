Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event, template) {

    // Current template instance
    var instance = Template.instance();

    // Iterates through each file uploaded
    FS.Utility.eachFile(event, function(file) {

      if (file) {

        var fileName = file.name;

        // Allowed file extensions for API documentation file
        var acceptedExtensions = ["yaml", "yml", "json"];

        if (instance.endsWith(fileName, acceptedExtensions)) {

          // Initialises new reader instance
          var reader = new FileReader();

          // Reads file
          reader.readAsText(file, "UTF-8");

          reader.onload = function (event) {

            // Gets file contents
            var importedFile = event.target.result;

            console.log(importedFile);

            // Checks for correct JSON or YAML syntax in file contents
            if (JSON.parse(importedFile) || jsyaml.safeLoad(importedFile)) {

              var doc = {};

              if (instance.endsWith(fileName, ['json'])){
                doc = JSON.parse(importedFile);
              } else if (instance.endsWith(fileName, ['yaml', 'yml'])){
                doc = jsyaml.load(importedFile);
              }

              // Insert fine contents to a colletion
              ApiDocs.insert(doc);

            } else {

              // Notifies user if not able to parse the file either as JSON or YAML objects.
              FlashMessages.sendError("Error when reading the file. Please check file contents for errors.");

            }
          }
        }else{

          // Notifies user if file extension provided is not supported
          FlashMessages.sendError("Only .json and .yaml(.yml) files are supported.");
        }
      }
    });
  }
});

Template.importApiDocumentation.created = function () {

  var instance = this;

  // function attached to template instance checks file extension
  instance.endsWith = function (filename, suffixList) {

    // variable that keeps state of is this filename contains provided extensions - false by default
    var state = false;

    // iterating through extensions passed into suffixList array
    for (var i=0; i <suffixList.length; i++){

      // parses line to check if filename contains current suffix
      var endsWith = filename.indexOf(suffixList[i], filename.length - suffixList[i].length) !== -1;

      // if current extension found in filename then change the state variable
      if (endsWith) state = true;

    }

    return state;
  };

};
