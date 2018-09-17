/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Npm packages imports
import SwaggerParser from 'swagger-parser';

import _ from 'lodash';

Meteor.methods({
  // Parameter is URL or file path to Swagger file
  parsedSwaggerDocument (swaggerFileUrl) {
    // Make sure swaggerFileUrl is a String
    check(swaggerFileUrl, String);

    return SwaggerParser.validate(swaggerFileUrl)
      .then((result) => {
        // Parsed and validated successfully
        // Return parsed object
        const schemes = _.get(result, 'schemes', []);
        // Checking of scheme contains only http protocol
        if (schemes[0] === 'http' && schemes.length === 1) {
          // Set the document contains only http protocol
          return true;
        }
        return false;
      })
      .catch((err) => {
        // Return error object
        throw new Meteor.Error(err.message);
      });
  },
});
