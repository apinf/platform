// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { HTTP } from 'meteor/http';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import _ from 'lodash';

AutoForm.addHooks('downloadSDK', {
  onSubmit (formValues, updateDoc, instance) {
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
    const url = `${host}/api/gen/clients/${parameter}`;

    // Get path to documentation file
    const pathToFile = instance.documentationFileURL;

    // Create POST options
    const options = {
      swaggerUrl: pathToFile,
    };

    // Start spinner when send request
    instance.callRequest.set(true);

    // Send POST request
    HTTP.post(url, { data: options }, (error, result) => {
      // If url is incorrect
      if (result === undefined) {
        // Get error message translation
        const message = TAPi18n.__('sdkCodeGeneratorModal_errorTextInvalidHost');

        // Alert user of error
        sAlert.error(message);
      } else {
        // Get information from Swagger API response
        const response = JSON.parse(result.content);

        if (result.statusCode === 200) {
          // Hide modal
          Modal.hide('sdkCodeGeneratorModal');

          // Go to link and download file
          window.location.href = response.link;
        } else {
          // Otherwise show an error message

          // Get error message translation
          const message = TAPi18n.__('sdkCodeGeneratorModal_errorText');

          // Alert user of error
          sAlert.error(message);
        }
      }
      $('button').removeAttr('disabled');
      // Finish spinner
      instance.callRequest.set(false);
    });
  },
});
