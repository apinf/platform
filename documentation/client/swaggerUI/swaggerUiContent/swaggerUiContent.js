import SwaggerUi from 'swagger-ui-browserify';

Template.swaggerUiContent.onCreated(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;

  // Create Swagger UI
  const swagger = window.swaggerUi = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
  });

  // Load Swagger UI
  swagger.load();
});

Template.swaggerUiContent.onRendered(function () {
  // Get URL of api documentation
  const documentationURL = this.data.apiDocumentation;

  // Display URL on Swagger UI input
  $('#input_baseUrl').val(documentationURL);
});
