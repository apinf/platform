/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages import
import _ from 'lodash';

Template.swaggerUi.onCreated(() => {
  const instance = Template.instance();
  // Set flag on Data is not Ready
  instance.dataFetched = new ReactiveVar(false);

  // Get url of api documentation
  const documentationURL = instance.data.api.documentationUrl();

  // Parsed swagger file
  Meteor.call('parsedSwaggerDocument', documentationURL, (error, result) => {
    if (error) {
      sAlert.error(error, { timeout: 'none' });
      // Document is invalid
      instance.documentationValid = false;
    } else {
      // Document is valid
      instance.documentationValid = true;

      // Get "schemes" property or set an empty array on default
      const schemes = _.get(result, 'schemes', []);

      // Checking of scheme contains only http protocol
      if (schemes[0] === 'http' && schemes.length === 1) {
        // Set the document contains only http protocol
        instance.useHttpProtocol = true;
      } else {
        // Document doesn't contain http protocol
        instance.useHttpProtocol = false;
      }
    }

    // Set flag Data is Ready
    instance.dataFetched.set(true);
  });
});

Template.swaggerUi.helpers({
  dataFetched () {
    const instance = Template.instance();
    // Get status of data is ready
    return instance.dataFetched.get();
  },
  documentationValid () {
    const instance = Template.instance();
    // Get status of api documentation is valid
    return instance.documentationValid;
  },
  useHttpProtocol () {
    const instance = Template.instance();
    // Get status of documentation has only http in schemes
    return instance.useHttpProtocol;
  },
});
