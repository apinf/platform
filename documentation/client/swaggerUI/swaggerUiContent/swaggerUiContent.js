import SwaggerUi from 'swagger-ui-browserify';

Template.swaggerUiContent.onCreated(function () {
  const instance = this;
  
  // Get URL of api documentation
  const documentationURL = this.data.apiDoc;
  
  const submitMethods = instance.data.api.submit_methods || []
  
  // Create Swagger UI
  const swagger = window.swaggerUi = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    supportedSubmitMethods: submitMethods,
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none'
  });
  // Load Swagger UI
  swagger.load();
  
  // instance.autorun(function () {
  // })
});

Template.swaggerUiContent.onRendered(function () {
  const instance = this;
  instance.autorun = () => {
    const submitMethods = instance.data.api.submit_methods || []
    swagger.setOption('supportedSubmitMethods', submitMethods)
    console.log('content onRendered')
  }
});
