/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

Template.swaggerUi.onCreated(() => {
  const instance = Template.instance();
  // Set flag on Data is not Ready
  instance.dataFetched = new ReactiveVar(false);

  // Get url of api documentation
  const documentationURL = instance.data.api.documentationUrl();

  // Parsed swagger file
  Meteor.call('parsedDocument', documentationURL, (error, result) => {
    // Document is valid on default
    instance.documentationValid = true;
    // Document doesn't contain http protocol on default
    instance.useHttpProtocol = false;

    // Document is not valid if result is {}
    if (result === {}) {
      // Set that document is not valid
      instance.documentationValid = false;
    }

    // Checking of scheme contains only http protocol
    if (result && result.schemes && result.schemes[0] === 'http') {
      // Set the document contains only http protocol
      instance.useHttpProtocol = true;
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
