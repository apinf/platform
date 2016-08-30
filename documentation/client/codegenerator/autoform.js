import { HTTP } from 'meteor/http';

import _ from 'lodash';

AutoForm.addHooks('downloadSDK', {
  onSubmit: function (formValues, updateDoc, instance) {
    // Prevent form from submitting
    this.event.preventDefault();

    // Get selected language from dropdown list
    const selectedLanguage = formValues.selectLanguage;

    // Get index of selected language in global list of languages
    const index = _.indexOf(instance.languageList, selectedLanguage);

    // Find mask of the language for url
    const parameter = instance.urlParameters[index];

    // Get host of code generator server
    let host = instance.codegenServer;

    // Delete last forward slash if it exists
    if (_.endsWith(host, '/')) {
      host = host.slice(0, -1);
    }

    // Create URL to send request
    const url = host + '/api/gen/clients/' + parameter;

    // Get path to documentation file
    const pathToFile = instance.documentationFileURL;

    // Create POST options
    const options = {
      'swaggerUrl': pathToFile
    };

    // Start spinner when send request
    instance.callRequest.set(true);

    // Send POST request
    HTTP.post(url, { data: options }, function (error, result) {
      // If url is incorrect
      if (result === undefined) {
        FlashMessages.sendError(TAPi18n.__('sdkCodeGeneratorModal_errorTextInvalidHost'));
      } else {
        // Get information from Swagger API response
        let response = JSON.parse(result.content);

        if (result.statusCode === 200) {
          // Hide modal
          Modal.hide('sdkCodeGeneratorModal');

          // Go to link and download file
          window.location.href = response.link;
        } else {
          // Otherwise show an error message
          FlashMessages.sendError(TAPi18n.__('sdkCodeGeneratorModal_errorText'));
        }
      }
      $('button').removeAttr('disabled');
      // Finish spinner
      instance.callRequest.set(false);
    });
  }
});
