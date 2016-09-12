import SwaggerUi from 'swagger-ui-browserify';
import { Apis } from '/apis/collection';

Template.swaggerUiContent.onCreated(function () {
  const instance = this;

  // Get URL of api documentation
  const documentationURL = this.data.apiDoc;

  // Create Swagger UI object
  const swagger = window.swaggerUi = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
  });

  // Subscribe to api collection
  instance.autorun(() => {
    // Get relevant api collection
    instance.subscribe('apiBackend', instance.data.api._id);

    // Get api
    const api = Apis.findOne(instance.data.api._id);

    // Set selected methods in Swagger
    swagger.setOption('supportedSubmitMethods', api.submit_methods);

    // Load Swagger UI
    swagger.load();
  });
});
