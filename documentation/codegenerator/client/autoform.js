import { HTTP } from 'meteor/http';

AutoForm.addHooks('downloadSDK', {
  onSubmit: function (formValues, updateDoc, callRequest) {
    // Prevent form from submitting
    this.event.preventDefault();

    // Get selected language from dropdown list
    const selectedLanguage = formValues.selectLanguage;

    // Get index of selected language in global list of languages
    const index = _.indexOf(LanguageList, selectedLanguage);

    // Find mask of the language for url
    const parameter = urlParameters[index];

    // Create URL to send request
    const url = 'https://generator.swagger.io/api/gen/clients/' + parameter;

    // Get path to documentation file
    const pathToFile = Session.get('currentDocumentationFileURL');

    // Create POST options
    const options = {
      'swaggerUrl': pathToFile
    };

    // Start spinner when send request
    callRequest.set(true);

    // Send POST request
    HTTP.post(url, { data: options }, function (error, result) {
      // Get information from Swagger API response
      let response = JSON.parse(result.content);

      if (result.statusCode === 200) {
        // Hide modal
        Modal.hide('sdkCodeGeneratorModal');

        // Go to link and download file
        window.location.href = response.link;
      } else {
        $('button').removeAttr('disabled');

        // Otherwise show an error message
        FlashMessages.sendError(TAPi18n.__('sdkCodeGeneratorModal_errorText'));
      }
      // Finish spinner
      callRequest.set(false);
    });
  }
});
