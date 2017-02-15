// Npm packages imports
import SwaggerParser from 'swagger-parser';

Meteor.methods({
  // Validate Swagger JSON/YAML
  // Params: URL or file path to Swagger file
  // Returns: true if valid else return error object
  isValidSwagger (swaggerFileUrl) {
    // Make sure swaggerFileUrl is a String
    check(swaggerFileUrl, String);

    return SwaggerParser.validate(swaggerFileUrl)
      .then(() => {
        // Parsed and validated successfully
        return true;
      })
      .catch((err) => {
        // Return error object
        return err;
      });
  },
});
