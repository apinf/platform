import SwaggerUi from 'swagger-ui-browserify'
import SwaggerClient from 'swagger-client'


Template.swaggerUiBody.onCreated(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;
  
  // Create Swagger UI
  let swagger = new SwaggerUi({
    url: documentationURL,
    // authorizations: {'apiKey': new SwaggerClient.ApiKeyAuthorization("api_key","special-key","query")},
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    onComplete: function (swaggerApi, swaggerUi) {
      console.log('Loaded SwaggerUI')
      
    },
    onFailure: function (error) {
      console.error('Unable to Load SwaggerUI', error)
    },
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none'
  });
  
  // Load Swagger UI
  swagger.load()
  
  // swagger.api.clientAuthorizations.add('auth_name', new SwaggerClient.ApiKeyAuthorization("api_key","special-key","query"));
  console.dir(swagger)
  
});

Template.swaggerUiBody.onRendered(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;
  
  // Display URL on Swagger UI input
  $('#input_baseUrl').val(documentationURL);
  
});