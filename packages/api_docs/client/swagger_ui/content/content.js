/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import ApiDocs from '/packages/api_docs/collection';
import ApiKeys from '/packages/api_keys/collection';
import ProxyBackends from '/packages/proxy_backends/collection';

Template.swaggerUiContent.onCreated(function () {
  const instance = this;
  // Get API item
  const api = instance.data.api;
  // Get user ID
  const userId = Meteor.userId();

  // Storage for configs data
  instance.configs = {};

  // Group together data about Proxy variables that need for Swagger
  instance.getDataForSwagger = (proxyBackend) => {
    // Placeholders
    let proxyBasePath;
    let proxyHost;
    let apiKeyValue;
    let apiKeyDisabled;

    // Get URL of related proxy
    proxyHost = proxyBackend.proxyUrl();

    // Make sure Proxy URL exists
    if (proxyHost) {
      // Get proxy base path or undefined by default
      proxyBasePath = _.get(proxyBackend, 'apiUmbrella.url_matches[0].frontend_prefix');

      // Delete last forward slash if it exists
      if (_.endsWith(proxyBasePath, '/')) {
        proxyBasePath = proxyBasePath.slice(0, -1);
      }

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

      // Get api key item
      const apiKey = ApiKeys.findOne({ proxyId: proxyBackend.proxyId, userId });

      // Get value of is API key disabled
      apiKeyDisabled = _.get(proxyBackend, 'apiUmbrella.settings.disable_api_key', false);

      // Get API key value or an empty line by default
      apiKeyValue = _.get(apiKey, 'apiUmbrella.apiKey', '');
    }

    return { proxyHost, proxyBasePath, apiKeyDisabled, apiKeyValue };
  };

  // Watch for changes of supportedSubmitMethods value
  instance.autorun(() => {
    // Get related documentation for current API
    const apiDoc = ApiDocs.findOne({ apiId: api._id }) || {};

    // Set specified methods by API Manager or don't allow any methods on default
    instance.configs.supportedSubmitMethods = apiDoc.submit_methods || [];
  });

  // Watch for changes of proxy backend configuration value
  instance.autorun(() => {
    // Get proxy backend
    const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

    // Make sure API has proxy backend configuration
    if (proxyBackend) {
      // Deconstruct object to single variables
      // Get Proxy host & base path values and API key values
      const { proxyHost, proxyBasePath, apiKeyDisabled, apiKeyValue } =
        instance.getDataForSwagger(proxyBackend);

      // Make sure proxy host and proxy base path exist
      if (proxyHost && proxyBasePath) {
        // Replace Swagger host to proxy host
        instance.configs.host = proxyHost;
        // Replace Swagger base path to proxy base path
        instance.configs.basePath = proxyBasePath;

        // Make sure API key is required for current Proxy backend
        if (!apiKeyDisabled) {
          // Create security definition for Swagger spec that provides Authorization for Proxy
          instance.configs.securityDefinitions = {
            proxyAuth: {
              description: 'Provide API key for Proxy authorization',
              type: 'apiKey',
              in: 'header',
              name: 'X-API-Key',
            },
          };

          // Make sure a user has API key
          if (apiKeyValue) {
            // Auto complete API key for Proxy Authorization
            instance.configs.apiKeyValues = {
              proxyAuth: apiKeyValue,
            };
          }
        }
      }
    } else {
      // Proxy Backend configuration can be removed
      // Then it needs to remove data about Proxy variables
      delete instance.configs.host;
      delete instance.configs.basePath;
      delete instance.configs.securityDefinitions;
      delete instance.configs.apiKeyValues;
    }
  });
});

Template.swaggerUiContent.onRendered(function () {
  // Get API item
  const api = this.data.api;

  // Update Swagger-UI when instance variables is changed
  this.autorun(() => {
    /* eslint-disable */
    // Disable eslint here to supress messages
    // about SwaggerUIBundle, SwaggerUIStandalonePreset, etc.
    // since we can't figure out how to import them directly
    // TODO: see if we can fix ESLint errors here properly, without suppressing
    const ui = SwaggerUIBundle({
      url: api.documentationUrl(),
      dom_id: '#swagger-ui',
      // Provides custom configs for Swagger
      configs: this.configs,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    });
    /* eslint-enable */
  });
});
