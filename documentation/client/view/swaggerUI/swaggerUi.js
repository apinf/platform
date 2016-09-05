import { Template } from 'meteor/templating';
import SwaggerUi from 'swagger-ui-browserify'
import 'swagger-ui/dist/css/screen.css'

Template.swaggerUi.onCreated(function () {
  const documentationURL = this.data.apiDocumentation;

  const swagger = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'options'],
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


  swagger.load()
});

Template.swaggerUi.onRendered(function () {
  const documentationURL = this.data.apiDocumentation;

  $('#input_baseUrl').val(documentationURL);

});