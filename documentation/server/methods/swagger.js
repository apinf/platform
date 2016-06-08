import SwaggerParser from 'swagger-parser';

Meteor.methods({
  // Validate Swagger JSON/YAML
  // Params: URL or file path to Swagger file
  // Returns: true if valid else return error object
  isValidSwagger: function(swaggerFileUrl) {
     return SwaggerParser.validate(swaggerFileUrl)
      .then( (swaggerApi) => {
        // Parsed and validated successfully
        return true;
      })
      .catch( (err) => {
        // Return error object
        return err;
      });
  }
});
