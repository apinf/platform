import SwaggerUi from 'swagger-ui-browserify';
import { Apis } from '/apis/collection';
import { ProxyBackends } from '/proxy_backends/collection'
import { Proxies } from '/proxies/collection'


import _ from 'lodash';

Template.swaggerUiContent.onCreated(function () {
  const instance = this;
  
  // Get URL of api documentation
  const documentationURL = this.data.apiDoc;
  
  // Get proxy
  const proxy = Proxies.findOne();
  
  // Get proxy backend
  const proxyBackend = ProxyBackends.findOne({"apiId": instance.data.api._id});
  
  // Get proxy host if it exists
  let proxyHost = proxy ? proxy.apiUmbrella.url : '';
  
  // Get values of proxy apiUmbrella
  const apiUmbrellaSettings = proxyBackend ? proxyBackend.apiUmbrella.url_matches : false;
  
  // Get proxy base path if it exists
  let proxyBasePath = apiUmbrellaSettings ? apiUmbrellaSettings[0].frontend_prefix : '';

  // Delete 'http://' prefix
  if (_.startsWith(proxyHost, 'http://')) {
    proxyHost = proxyHost.slice(7, proxyHost.length);
  }
  // Delete 'https://' prefix
  else {
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

  // Create Swagger UI object
  const swagger = new SwaggerUi({
    url: documentationURL,
    dom_id: 'swagger-ui-container',
    useJQuery: true,
    supportHeaderParams: true,
    apisSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
    onComplete: function () {
      if (proxyHost) {
        // Replace Swagger host to proxy host
        swagger.api.setHost(proxyHost);
      }

      if (proxyBasePath) {
        // Replace Swagger base path to proxy base path
        swagger.api.setBasePath(proxyBasePath);
      }
      console.log('swagger host',swagger.api.host , 'swagger basePath', swagger.api.basePath)
    }
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
