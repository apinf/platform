/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// APINF imports
import 'swagger-ui/dist/css/screen.css';

Template.swaggerUi.onCreated(() => {
  const instance = Template.instance();
  // Set flag on Data is not Ready
  instance.dataFetched = new ReactiveVar(false);

  // Get url of api documentation
  const documentationURL = instance.data.api.documentation();

  // Check validation of Swagger file
  Meteor.call('isValidSwagger', documentationURL, (error, result) => {
    // result can be 'true' or '{}'
    if (result === true) {
      // Save result in template instance
      instance.documentationValid = result;
    }
    // Set flag on Data is Ready
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
});
