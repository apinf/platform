/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Npm packages imports
import SwaggerParser from 'swagger-parser';

Meteor.methods({
  // Parameter is URL or file path to Swagger file
  parsedSwaggerDocument (swaggerFileUrl) {
    // Make sure swaggerFileUrl is a String
    check(swaggerFileUrl, String);

    return SwaggerParser.validate(swaggerFileUrl)
    .then((result) => {
      // Parsed and validated successfully
      // Return parsed object
      return result;
    })
    .catch((err) => {
      // Return error object
      throw new Meteor.Error(err.message);
    });
  },
  testing: function () {
    this.unblock();
    return Meteor.http.call("GET", "https://openapi.space/api/v1/apis?limit=10&offset=0&sort=NAME&order=ASC");
  }
});
