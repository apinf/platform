import SwaggerParser from 'swagger-parser';

Meteor.methods({
  // Validate Swagger JSON/YAML
  // Params: URL or file path to Swagger file
  // Returns: true if valid else false
  validateSwagger: function(url) {
     SwaggerParser.validate(url)
      .then(function(api){
        console.log("Your API is valid!");
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
        return true;
      })
      .catch(function(err){
        console.log(err);
        return false;
      });
  }
});
