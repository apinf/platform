Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event, template) {
    // console.log(AutoForm.reactiveFormData());

    // Allowed file extensions for API documentation file
    const acceptedExtensions = ['yaml', 'yml', 'json'];

    // Current template instance
    const instance = Template.instance();

    // Iterates through each file uploaded
    FS.Utility.eachFile(event, function (file) {
      if (file) {
        // Get file's name & parse the file string to URI object
        const fileName = new URI(file.name);

        // Get the file extension
        const fileExtension = fileName.suffix().toLowerCase();

        // Check if the file suffix is in the allowed extensions list
        const extensionAllowed = _.contains(acceptedExtensions, fileExtension);

        // Read file if the extension is allowed
        if (extensionAllowed) {
          // Initialises new reader instance
          const reader = new FileReader();

          // Reads file
          reader.readAsText(file, 'UTF-8');

          reader.onload = function (event) {
            // Gets file contents
            const importedFile = event.target.result;

            // Checks for correct JSON or YAML syntax in file contents
            if (JSON.parse(importedFile) || jsyaml.safeLoad(importedFile)) {
              let doc = {};

              // Checks file's extension for its conversion to JSON object
              if (fileExtension === 'json') {
                // Convert JSON string to JSON object
                doc = JSON.parse(importedFile);
              } else if (_.contains(['yaml', 'yml'], fileExtension)) {
                // Convert YAML string/object to JSON object
                doc = jsyaml.load(importedFile);
              }

              // Insert fine contents to a colletion
              const apiDocsId = ApiDocs.insert(doc);

              // Set session variable containing API Docs ID,
              // used for attaching apiBackendId to apiDocs document on success
              Session.set('apiDocsId', apiDocsId);
            } else {
              // Get error message text
              const message = TAPi18n.__('importApiDocumentation_fileReadError_message');

              // Notifies user if not able to parse the file either as JSON or YAML objects.
              sAlert.error(message);
            }
          };
        } else {
          // Get error message text
          const message = TAPi18n.__('importApiDocumentation_fileExtensionError_message');

          // Notifies user if file extension provided is not supported
          sAlert.error(message);
        }
      }
    });
  },
});
