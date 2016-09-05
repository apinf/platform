import SwaggerUi from 'swagger-ui-browserify'


Template.swaggerUiBody.onCreated(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;
  
  // Create Swagger UI
  const swagger = new SwaggerUi({
    url: documentationURL,
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
});

Template.swaggerUiBody.onRendered(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;
  
  // Display URL on Swagger UI input
  $('#input_baseUrl').val(documentationURL);
  
});