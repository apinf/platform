// Meteor packages imports
import ApiKeys from '/api_keys/collection';
import Apis from '/apis/collection';
import Proxies from '/proxies/collection';
import ProxyBackends from '/proxy_backends/collection';

// Npm packages imports
import SwaggerClient from 'swagger-client';
import SwaggerUi from 'swagger-ui-browserify';
import _ from 'lodash';

Template.swaggerUiContent.onCreated(function () {
  const instance = this;

  // Get URL of api documentation
  const documentationURL = this.data.apiDoc;

  // Get proxy
  const proxy = Proxies.findOne();

  // Get proxy backend
  const proxyBackend = ProxyBackends.findOne({ apiId: instance.data.api._id });

  // Get proxy host if it exists
  let proxyHost = proxy ? proxy.apiUmbrella.url : '';

  // Get values of proxy apiUmbrella
  const apiUmbrellaSettings = proxyBackend ? proxyBackend.apiUmbrella.url_matches : false;

  // Get proxy base path if it exists
  let proxyBasePath = apiUmbrellaSettings ? apiUmbrellaSettings[0].frontend_prefix : '';

  if (_.startsWith(proxyHost, 'http://')) {
    // Delete 'http://' prefix
    proxyHost = proxyHost.slice(7, proxyHost.length);
  } else {
    // Delete 'https://' prefix
    proxyHost = proxyHost.slice(8, proxyHost.length);
  }

  // Delete last forward slash if it exists
  if (_.endsWith(proxyHost, '/')) {
    proxyHost = proxyHost.slice(0, -1);
  }

  // Delete last forward slash if it exists
  if (_.endsWith(proxyBasePath, '/')) {
    proxyBasePath = proxyBasePath.slice(0, -1);
  }

  // Get api key collection
  const apiKey = proxy ? ApiKeys.findOne({ proxyId: proxy._id, userId: Meteor.userId() }) : '';

  // Check if api-key exists
  const apiKeyValue = apiKey ? apiKey.apiUmbrella.apiKey : '';

  // Create object to save information about property of api-key authorization
  const infoAuth = {};

  // Create Swagger UI object
  const swagger = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
    onComplete () {
      if (proxyHost) {
        // Replace Swagger host to proxy host
        swagger.api.setHost(proxyHost);
      }

      if (proxyBasePath) {
        // Replace Swagger base path to proxy base path
        swagger.api.setBasePath(proxyBasePath);
      }

      // If api-key exists, add it to authorization form
      if (apiKeyValue) {
        // Search information information about property of api-key authorization
        _.forEach(swagger.api.auths, (authorization) => {
          if (authorization.type === 'apiKey') {
            infoAuth.title = authorization.name;
            infoAuth.keyName = authorization.value.name;
            infoAuth.keyIn = authorization.value.in;
          }
        });

        // Create Authorization Object for swagger client
        const authz = new SwaggerClient.ApiKeyAuthorization(
          infoAuth.keyName,
          apiKeyValue,
          infoAuth.keyIn
        );

        // Input user api-key in field
        swagger.api.clientAuthorizations.add(infoAuth.title, authz);
      }
    },
  });

  // Subscribe to api collection
  instance.autorun(() => {
    // Get relevant api collection
    instance.subscribe('apiBackend', instance.data.api._id);

    // Get api
    const api = Apis.findOne(instance.data.api._id);

    // Check on documentation exists
    if (api.documentationFileId) {
      // Set selected methods in Swagger
      swagger.setOption('supportedSubmitMethods', api.submit_methods);

      // Load Swagger UI
      swagger.load();
    } else if (swagger.mainView) {
      // Clear swagger container
      swagger.mainView.clear();
    }
  });
});
