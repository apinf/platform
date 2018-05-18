/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import ProxyV1 from '/apinf_packages/rest_apis/server/proxy';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionProxies from '/apinf_packages/rest_apis/lib/descriptions/proxies_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

ProxyV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

// Request /rest/v1/proxies for Proxies collection
ProxyV1.addCollection(Proxies, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Response contains a list of all public entities within the collection
    getAll: {
      authRequired: true,
      // Admin role is required
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ProxyV1.swagger.tags.proxy,
        ],
        summary: 'Get list of available proxies.',
        description: descriptionProxies.getAllProxies,
        parameters: [
          ProxyV1.swagger.params.proxyType,
        ],
        responses: {
          200: {
            description: 'List of available proxies',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'success',
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/proxyResponse',
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (!requestorId) {
          return errorMessagePayload(400, 'Erroneous or missing parameter.');
        }

        // Requestor must be an administrator
        if (!Roles.userIsInRole(requestorId, ['admin'])) {
          return errorMessagePayload(403, 'User does not have permission.');
        }

        let query = {};

        const queryParams = this.queryParams;
        // Parse query parameters
        if (queryParams.type) {
          const allowedTypes = ['apiUmbrella', 'emq'];
          if (!allowedTypes.includes(queryParams.type)) {
            return errorMessagePayload(400, 'Parameter "type" has erroneous value.',
            'type', queryParams.type);
          }
          query = { type: queryParams.type };
        }

        // Get proxies data
        const proxyList = Proxies.find(query).fetch();

        // OK response with Proxy data
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: proxyList,
          },
        };
      },
    },
    // Response contains the entity with the given :id
    get: {
      authRequired: true,
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ProxyV1.swagger.tags.proxy,
        ],
        summary: 'Fetch Proxy with specified ID.',
        description: descriptionProxies.getProxy,
        parameters: [
          ProxyV1.swagger.params.proxyId,
        ],
        responses: {
          200: {
            description: 'Proxy found successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'success',
                },
                data: {
                  $ref: '#/definitions/proxyResponse',
                },
              },
            },
          },
          400: {
            description: 'Erroneous or missing parameter',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'Proxy is not Found',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        const proxyId = this.urlParams.id;

        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (!requestorId) {
          return errorMessagePayload(400, 'Erroneous or missing parameter.');
        }

        // Requestor must be an administrator
        if (!Roles.userIsInRole(requestorId, ['admin'])) {
          return errorMessagePayload(403, 'User does not have permission.');
        }

        // Get selected Proxy data
        const proxy = Proxies.findOne({ _id: proxyId });

        // Return error response, it Proxy is not found.
        if (!proxy) {
          return errorMessagePayload(404, 'Proxy with specified ID is not found.');
        }

        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: proxy,
          },
        };
      },
    },
    // Create a new Proxy
    post: {
      authRequired: true,
      // Admin role is required
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ProxyV1.swagger.tags.proxy,
        ],
        summary: 'Add a new Proxy.',
        description: descriptionProxies.postProxy,
        parameters: [
          ProxyV1.swagger.params.proxyPostRequest,
        ],
        responses: {
          201: {
            description: 'Proxy added successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/proxyResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
          },
          401: {
            description: 'Authentication is required',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (!requestorId) {
          return errorMessagePayload(400, 'Erroneous or missing parameter.');
        }

        // Requestor must be an administrator
        if (!Roles.userIsInRole(requestorId, ['admin'])) {
          return errorMessagePayload(403, 'User does not have permission.');
        }

        const bodyParams = this.bodyParams;

        // structure for inserting values
        const proxyData = {};

        // structure for validating values against schema
        const validateFields = {
          name: bodyParams.name,
          type: bodyParams.type,
          'apiUmbrella.url': bodyParams.umbProxyUrl,
          'emq.brokerEndpoints.$.protocol': bodyParams.emqProtocol,
          'emq.brokerEndpoints.$.port': bodyParams.emqPort,
        };

        // Name is a required field
        if (!bodyParams.name) {
          return errorMessagePayload(400, 'Parameter "name" is mandatory.');
        }
        // Validate name
        let isValid = Proxies.simpleSchema().namedContext().validateOne(
          validateFields, 'name');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "name" is erroneous.');
        }

        // Check if Proxy with same name already exists
        const duplicateProxy = Proxies.findOne({ name: bodyParams.name });

        if (duplicateProxy) {
          const detailLine = 'Duplicate: Proxy with same name already exists.';
          return errorMessagePayload(400, detailLine, 'id', duplicateProxy._id);
        }

        if (!bodyParams.description) {
          return errorMessagePayload(400, 'Parameter "description" is mandatory.');
        }

        if (!bodyParams.type) {
          return errorMessagePayload(400, 'Parameter "type" is mandatory.');
        }
        // Type is either apiUmbrella or emq
        if (bodyParams.type) {
          isValid = Proxies.simpleSchema().namedContext().validateOne(
            validateFields, 'type');

          if (!isValid) {
            return errorMessagePayload(400, 'Erroneous Proxy type.');
          }
        }

        // Check apiUmbrella elasticSearch URL, used in both cases
        if (!bodyParams.esUrl) {
          return errorMessagePayload(400, 'Parameter "esUrl" is mandatory.');
        }
        // regexes are missing from table, so check generally
        const re = new RegExp(SimpleSchema.RegEx.Url);

        if (!bodyParams.esUrl.match(re)) {
          return errorMessagePayload(400, 'Parameter "esUrl" is not valid.');
        }

        // Fill common parameters
        proxyData.name = bodyParams.name;
        proxyData.type = bodyParams.type;
        proxyData.description = bodyParams.description;

        // Check parameter sets depending on proxy type
        if (bodyParams.type === 'apiUmbrella') {
          // Check apiUmbrella Proxy URL
          if (!bodyParams.umbProxyUrl) {
            return errorMessagePayload(400, 'Parameter "umbProxyUrl" is mandatory.');
          }
          // Check URL validation
          isValid = Proxies.simpleSchema().namedContext().validateOne(
            validateFields, 'apiUmbrella.url');

          if (!isValid) {
            return errorMessagePayload(400, 'Proxy URL not valid.');
          }
          // Check apiUmbrella API Key
          if (!bodyParams.umbApiKey) {
            return errorMessagePayload(400, 'Parameter "umbApiKey" is mandatory.');
          }
          // Check apiUmbrella Authentication Token
          if (!bodyParams.umbAuthToken) {
            return errorMessagePayload(400, 'Parameter "umbAuthToken" is mandatory.');
          }
          // Fill apiUmbrella parameters
          const apiUmbrella = {
            url: bodyParams.umbProxyUrl,
            apiKey: bodyParams.umbApiKey,
            authToken: bodyParams.umbAuthToken,
            elasticsearch: bodyParams.esUrl,
          };
          // Add apiUmbrella data into proxy data
          proxyData.apiUmbrella = apiUmbrella;
        } else {
          // Has to be EMQ parameters of broker endpoints in question
          // Check Protocol
          if (!bodyParams.emqProtocol) {
            return errorMessagePayload(400, 'Parameter "emqProtocol" is mandatory.');
          }
          // Check URL validation
          isValid = Proxies.simpleSchema().namedContext().validateOne(
            validateFields, 'emq.brokerEndpoints.$.protocol');

          if (!isValid) {
            return errorMessagePayload(400, 'EMQ protocol not valid.');
          }
          // Check EMQ host
          if (!bodyParams.emqHost) {
            return errorMessagePayload(400, 'Parameter "emqHost" is mandatory.');
          }
          // regex missing from table, so check generally
          if (!bodyParams.emqHost.match(re)) {
            return errorMessagePayload(400, 'Parameter "emqHost" is not valid.');
          }

          // Check EMQ host port
          if (!bodyParams.emqPort) {
            return errorMessagePayload(400, 'Parameter "emqPort" is mandatory.');
          }
          // Check port validation
          if (isNaN(bodyParams.emqPort) || bodyParams.emqPort < 0 || bodyParams.emqPort > 65535) {
            return errorMessagePayload(400, 'Parameter "emqPort" has erroneous value.',
            'emqPort', bodyParams.emqPort);
          }

          // Check EMQ TLS
          if (!bodyParams.emqTLS) {
            return errorMessagePayload(400, 'Parameter "emqTLS" is mandatory.');
          }

          if (bodyParams.emqTLS === 'true') {
            bodyParams.emqTLS = true;
          } else if (bodyParams.emqTLS === 'false') {
            bodyParams.emqTLS = false;
          } else {
            return errorMessagePayload(400, 'Parameter "emqTLS" has erroneous value.');
          }

          // Check EMQ http API
          if (!bodyParams.emqHttpApi) {
            return errorMessagePayload(400, 'Parameter "emqHttpApi" is mandatory.');
          }
          // regex missing from table, so check generally
          if (!bodyParams.emqHttpApi.match(re)) {
            return errorMessagePayload(400, 'Parameter "emqHttpApi" is not valid.');
          }

          // Fill EMQ parameters
          const emq = {};
          const brokerEndpoints = [];
          const brokerEndpoint = {
            protocol: bodyParams.emqProtocol,
            host: bodyParams.emqHost,
            port: bodyParams.emqPort,
            tls: bodyParams.emqTLS,
          };

          brokerEndpoints[0] = brokerEndpoint;
          emq.brokerEndpoints = brokerEndpoints;
          emq.httpApi = bodyParams.emqHttpApi;
          emq.elasticsearch = bodyParams.esUrl;

          // Add EMQ data into proxy data
          proxyData.emq = emq;
        }

        // Insert Proxy data into collection
        const proxyId = Proxies.insert(proxyData);

        // If insert failed, stop and send response
        if (!proxyId) {
          return errorMessagePayload(500, 'Insert Proxy into database failed.');
        }

        // Get inserted Proxy data to check, if insert was successful
        const insertedProxy = Proxies.findOne({ _id: proxyId });

        // Return error response, it Proxy is not found.
        if (!insertedProxy) {
          return errorMessagePayload(404, 'Proxy with specified ID is not found.');
        }

        return {
          statusCode: 201,
          body: {
            status: 'success',
            data: insertedProxy,
          },
        };
      },
    },
    // Modify the entity with the given :id with the data contained in the request body.
    put: {
      authRequired: true,
      // Admin role is required
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ProxyV1.swagger.tags.proxy,
        ],
        summary: 'Update Proxy.',
        description: descriptionProxies.putProxy,
        parameters: [
          ProxyV1.swagger.params.proxyId,
          ProxyV1.swagger.params.proxyPutRequest,
        ],
        responses: {
          200: {
            description: 'Proxy updated successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/proxyResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'Proxy is not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        /* Logic in nutshell
           1. Given parameter values are copied to bodyParams
           2. Existing Proxy values are read from DB to be basis for update (proxyData)
           3. Processing
              3.1 Given parameter values are verified, if necessary
              3.2 proxyData parameters are modified with new parameter values (bodyParams)
              3.3 Processed parameters are removed from bodyParams
           4. Checked, if unprocessed, i.e. erroneous parameters are left in bodyParams
           5. Modified proxyData is updated to DB
           6. Proxy data is read from DB and returned in response
        */

        // Get given parameters
        const bodyParams = this.bodyParams;

        if (!Object.keys(bodyParams).length) {
          return errorMessagePayload(400, 'No parameters given.');
        }

        // Get ID of Proxy to be updated
        const proxyId = this.urlParams.id;

        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (!requestorId) {
          return errorMessagePayload(400, 'Erroneous or missing parameter.');
        }

        // Requestor must be an administrator
        if (!Roles.userIsInRole(requestorId, ['admin'])) {
          return errorMessagePayload(403, 'User does not have permission.');
        }

        // Get the proxy data to be updated
        const proxyData = Proxies.findOne({ _id: proxyId });

        // Return error response, it Proxy is not found.
        if (!proxyData) {
          return errorMessagePayload(404, 'Proxy with specified ID is not found.');
        }

        // Structure for validating values against schema
        const validateFields = {
          name: bodyParams.name,
          type: bodyParams.type,
          'apiUmbrella.url': bodyParams.umbProxyUrl,
          'emq.brokerEndpoints.$.protocol': bodyParams.emqProtocol,
          'emq.brokerEndpoints.$.port': bodyParams.emqPort,
        };

        // In update we do not need id of existing proxy's data
        delete proxyData._id;

        // regexes are missing from table from part of fields, so check generally
        const re = new RegExp(SimpleSchema.RegEx.Url);

        // Check apiUmbrella elasticSearch URL, might be used in both cases
        if (bodyParams.esUrl) {
          if (!bodyParams.esUrl.match(re)) {
            return errorMessagePayload(400, 'Parameter "esUrl" is not valid.');
          }
        }

        // Update Name, if it is given properly
        if (bodyParams.name) {
          // Validate name
          const isValid = Proxies.simpleSchema().namedContext().validateOne(
            validateFields, 'name');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter "name" is erroneous.');
          }
          // Check if Proxy with same name already exists
          const duplicateProxy = Proxies.findOne({ name: bodyParams.name });

          if (duplicateProxy) {
            const detailLine = 'Duplicate: Proxy with same name already exists.';
            return errorMessagePayload(400, detailLine, 'id', duplicateProxy._id);
          }

          proxyData.name = bodyParams.name;
          delete bodyParams.name;
        }

        // Check if Description is given
        if (bodyParams.description) {
          proxyData.description = bodyParams.description;
          delete bodyParams.description;
        }

        // Update parameter sets depending on existing proxy type
        if (proxyData.type === 'apiUmbrella') {
          // Check apiUmbrella Proxy URL
          if (bodyParams.umbProxyUrl) {
            // Check URL validation
            const isValid = Proxies.simpleSchema().namedContext().validateOne(
              validateFields, 'apiUmbrella.url');

            if (!isValid) {
              return errorMessagePayload(400, 'Proxy URL not valid.');
            }
            proxyData.apiUmbrella.url = bodyParams.umbProxyUrl;
            delete bodyParams.umbProxyUrl;
          }

          // Check apiUmbrella API Key
          if (bodyParams.umbApiKey) {
            proxyData.apiUmbrella.apiKey = bodyParams.umbApiKey;
            delete bodyParams.umbApiKey;
          }
          // Check apiUmbrella Authentication Token
          if (bodyParams.umbAuthToken) {
            proxyData.apiUmbrella.authToken = bodyParams.umbAuthToken;
            delete bodyParams.umbAuthToken;
          }
          if (bodyParams.esUrl) {
            proxyData.apiUmbrella.elasticsearch = bodyParams.esUrl;
            delete bodyParams.esUrl;
          }
        } else {
          // Based on current EMQ parameters
          // Check EMQ http API
          if (bodyParams.emqHttpApi) {
            // regex missing from table, so check generally
            if (!bodyParams.emqHttpApi.match(re)) {
              return errorMessagePayload(400, 'Parameter "emqHttpApi" is not valid.');
            }
            proxyData.emq.httpApi = bodyParams.emqHttpApi;
            delete bodyParams.emqHttpApi;
          }

          // Check is ElasticSearch URL was given
          if (bodyParams.esUrl) {
            proxyData.emq.elasticsearch = bodyParams.esUrl;
            delete bodyParams.esUrl;
          }
          // Check if broker endpoint data is to be modified
          // Count number of broker endpoints currently in DB
          const countOfBE = proxyData.emq.brokerEndpoints.length;

          // Is the beIndex given
          if (bodyParams.beIndex) {
            // Does the beIndex have correct value
            if (isNaN(bodyParams.beIndex) ||
                1 * bodyParams.beIndex < 0 ||
                1 * bodyParams.beIndex > countOfBE) {
              const detailLine = `Allowed range for 'beIndex' is 0 - ${countOfBE}`;
              return errorMessagePayload(400, detailLine, 'beIndex', bodyParams.beIndex);
            }
            // At least one of broker endpoint values must be given
            if (!bodyParams.emqProtocol &&
                !bodyParams.emqHost &&
                !bodyParams.emqPort &&
                !bodyParams.emqTLS) {
              const detailLine = 'Broker endpoint index given without change values.';
              return errorMessagePayload(400, detailLine);
            }
          }

          // Is broker endpoint data given
          if (bodyParams.emqProtocol ||
              bodyParams.emqHost ||
              bodyParams.emqPort ||
              bodyParams.emqTLS) {
            // Also broker endpoint index must be given
            if (!bodyParams.beIndex) {
              return errorMessagePayload(400, 'Index for broker endpoint is missing.');
            }

            // Object for collecting input parameters
            let brokerEndpoint = {};
            if (proxyData.emq.brokerEndpoints[bodyParams.beIndex]) {
              // If broker endpoint exists, we are updating it
              brokerEndpoint = proxyData.emq.brokerEndpoints[bodyParams.beIndex];
            } else if (!bodyParams.emqProtocol ||
                       !bodyParams.emqHost ||
                       !bodyParams.emqPort ||
                       !bodyParams.emqTLS) {
              // BE does not exist, so we are creating a new one
              // All related parameters are needed
              return errorMessagePayload(400, 'All broker endpoint parameters are needed.');
            }

            // Check Protocol
            if (bodyParams.emqProtocol) {
              // Check URL validation
              const isValid = Proxies.simpleSchema().namedContext().validateOne(
                validateFields, 'emq.brokerEndpoints.$.protocol');

              if (!isValid) {
                return errorMessagePayload(400, 'EMQ protocol not valid.');
              }
              brokerEndpoint.protocol = bodyParams.emqProtocol;
              delete bodyParams.emqProtocol;
            }
            // Check EMQ host
            if (bodyParams.emqHost) {
              // regex missing from table, so check generally
              if (!bodyParams.emqHost.match(re)) {
                return errorMessagePayload(400, 'Parameter "emqHost" is not valid.');
              }
              brokerEndpoint.host = bodyParams.emqHost;
              delete bodyParams.emqHost;
            }
            // Check EMQ host port
            if (bodyParams.emqPort) {
              // Check port validation
              if (isNaN(bodyParams.emqPort) ||
                  bodyParams.emqPort < 0 ||
                  bodyParams.emqPort > 65535) {
                return errorMessagePayload(400, 'Parameter "emqPort" has erroneous value.',
                'emqPort', bodyParams.emqPort);
              }
              brokerEndpoint.port = bodyParams.emqPort;
              delete bodyParams.emqPort;
            }
            // Check EMQ TLS
            if (bodyParams.emqTLS) {
              if (bodyParams.emqTLS === 'true') {
                bodyParams.emqTLS = true;
              } else if (bodyParams.emqTLS === 'false') {
                bodyParams.emqTLS = false;
              } else {
                return errorMessagePayload(400, 'Parameter "emqTLS" has erroneous value.');
              }
              brokerEndpoint.tls = bodyParams.emqTLS;
              delete bodyParams.emqTLS;
            }
            // Fill newly filled or modified broker endpoint to proxy data
            proxyData.emq.brokerEndpoints[bodyParams.beIndex] = brokerEndpoint;
            delete bodyParams.beIndex;
          }

          // Check if a broker endpoint is to be removed
          if (bodyParams.beIndexRemove) {
            // Check if beIndexRemove has correct value
            if (isNaN(bodyParams.beIndexRemove) ||
                1 * bodyParams.beIndexRemove < 0 ||
                1 * bodyParams.beIndexRemove > (countOfBE - 1)) {
              const detailLine = `Allowed range for "beIndexRemove" is 0 - ${countOfBE - 1}`;
              return errorMessagePayload(400, detailLine, 'beIndexRemove',
                bodyParams.beIndexRemove);
            }
            if (!proxyData.emq.brokerEndpoints[bodyParams.beIndexRemove]) {
              // Error: Broker Endpoint does not exist
              return errorMessagePayload(400, 'Broker endpoint does not exist.');
            }
            // Remove the indicated broker endpoint
            delete proxyData.emq.brokerEndpoints[bodyParams.beIndexRemove];
            delete bodyParams.beIndexRemove;
          }
        }
        // If there are any parameters left, they are erroneous
        if (Object.keys(bodyParams).length) {
          return errorMessagePayload(400, 'Unknown parameters were given.', 'Params', bodyParams);
        }

        // Update changed Proxy data
        Proxies.update({ _id: proxyId }, { $set: proxyData });

        // Get inserted Proxy data to response with successful outcome
        const insertedProxy = Proxies.findOne({ _id: proxyId });

        // Return error response, it Proxy is not found.
        if (!insertedProxy) {
          return errorMessagePayload(404, 'Proxy with specified ID is not found.');
        }

        // OK response with API data
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: insertedProxy,
          },
        };
      },
    },
    // Remove a Proxy
    delete: {
      authRequired: true,
      // Admin role is required
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ProxyV1.swagger.tags.proxy,
        ],
        summary: 'Delete API.',
        description: descriptionProxies.deleteProxy,
        parameters: [
          ProxyV1.swagger.params.proxyId,
        ],
        responses: {
          204: {
            description: 'API removed successfully.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'API is not found',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Get ID of Proxy
        const proxyId = this.urlParams.id;

        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (!requestorId) {
          return errorMessagePayload(400, 'Erroneous or missing parameter.');
        }

        // Requestor must be an administrator
        if (!Roles.userIsInRole(requestorId, ['admin'])) {
          return errorMessagePayload(403, 'User does not have permission.');
        }

        // Get proxy in question
        const proxy = Proxies.findOne({ _id: proxyId });

        // Return error response, it Proxy is not found.
        if (!proxy) {
          return errorMessagePayload(404, 'Proxy with specified ID is not found.');
        }

        // Return error response, if there are connected Proxy backends.
        const connectedProxyBackends = ProxyBackends.find({ proxyId }).count();
        if (connectedProxyBackends) {
          const detailLine = 'Not allowed because of connected proxy backends.';
          return errorMessagePayload(404, detailLine, 'nbr of ', connectedProxyBackends);
        }

        // Remove Proxy document
        Meteor.call('removeProxy', proxyId, (err) => {
          // Response with error if something went wrong
          if (err) {
            return errorMessagePayload(500, 'Proxy removal failed.');
          }
          return 0;
        });

        // No content with 204
        return {
          statusCode: 204,
          body: {
            status: 'success',
            message: 'Proxy removed',
          },
        };
      },
    },
  },
});
// Request /rest/v1/proxies/:id/proxyBackends/
ProxyV1.addRoute('proxies/:id/proxyBackends', {
  // Show list of proxy backends connected to Proxy
  get: {
    authRequired: true,
    // Admin role is required
    roleRequired: ['admin'],
    swagger: {
      tags: [
        ProxyV1.swagger.tags.proxy,
      ],
      summary: 'Get list of proxy backends connected to Proxy with specified ID.',
      description: descriptionProxies.getProxyBackends,
      parameters: [
        ProxyV1.swagger.params.proxyId,
      ],
      responses: {
        200: {
          description: 'Proxy backend list found successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              data: {
                $ref: '#/definitions/proxyBackendResponse',
              },
            },
          },
        },
        404: {
          description: 'Proxy is not Found',
        },
      },
    },
    action () {
      const proxyId = this.urlParams.id;

      // Get requestor ID from header
      const requestorId = this.request.headers['x-user-id'];

      if (!requestorId) {
        return errorMessagePayload(400, 'Erroneous or missing parameter.');
      }

      // Requestor must be an administrator
      if (!Roles.userIsInRole(requestorId, ['admin'])) {
        return errorMessagePayload(403, 'User does not have permission.');
      }

      // Get selected Proxy data
      const proxy = Proxies.findOne({ _id: proxyId });

      // Return error response, if Proxy is not found.
      if (!proxy) {
        return errorMessagePayload(404, 'Proxy with specified ID is not found.');
      }

      // Return list of proxy backend ids.
      const connectedProxyBackends = ProxyBackends.find({ proxyId }).map((proxyBackend) => {
        return proxyBackend._id;
      });

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: connectedProxyBackends,
        },
      };
    },
  },

});

