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
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
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
        description: descriptionProxies.getProxies,
        parameters: [],
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
      authRequired: false,
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
          ProxyV1.swagger.params.proxyRequest,
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
        const userId = this.userId;
        const bodyParams = this.bodyParams;

        // Include also user ID into DB
        bodyParams.created_by = userId;

        // structure for validating values against schema
        const validateFields = {
          name: bodyParams.name,
          description: bodyParams.description,
          type: bodyParams.type,
          apiUmbrella: {
            url: bodyParams.umbProxyUrl,
            apikey: bodyParams.umbApiKey,
            authToken: bodyParams.umbAuthToken,
            elasticSearch: bodyParams.elasticSearch,

          },
        };

        // Name is a required field
        if (!bodyParams.name) {
          return errorMessagePayload(400, 'Parameter "name" is mandatory.');
        }

        // Validate name
        let isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'name');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "name" is erroneous.');
        }

        // Description must not exceed field length in DB
        if (bodyParams.description) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }


        // URL is a mandatory field
        if (!bodyParams.url) {
          return errorMessagePayload(400, 'Parameter "url" is mandatory.');
        }

        // Validate URL
        isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'url');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "url" must be a valid URL with http(s).');
        }

        // Check if API with same name already exists
        const duplicateApi = Apis.findOne({ name: bodyParams.name });

        if (duplicateApi) {
          const detailLine = 'Duplicate: API with same name already exists.';
          return errorMessagePayload(400, detailLine, 'id', duplicateApi._id);
        }


        // Is value of lifecycle status allowed
        if (bodyParams.lifecycleStatus) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        const isPublicParam = bodyParams.isPublic;

        if (isPublicParam) {
          if (isPublicParam === 'true') {
            bodyParams.isPublic = true;
          } else if (isPublicParam === 'false') {
            bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }

        const documentationUrl = bodyParams.documentationUrl;
        const externalDocumentation = bodyParams.externalDocumentation;
        // Regex for http(s) protocol
        const regex = SimpleSchema.RegEx.Url;

        // Documentation URL must have URL format
        if (documentationUrl) {
          // Check link validity
          if (!regex.test(documentationUrl)) {
            // Error message
            const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Link to an external site must have URL format
        if (externalDocumentation) {
          // Check link validity
          if (!regex.test(externalDocumentation)) {
            // Error message
            const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Get formed slug
        const slugData = Meteor.call('formSlugFromName', 'Apis', bodyParams.name);
        let apiData = {};
        // If formed slug true
        if (slugData && typeof slugData === 'object') {
          // Add manager IDs list into and slug
          apiData = Object.assign({ managerIds: [userId] }, bodyParams, slugData);
        } else {
          return errorMessagePayload(500, 'Forming slug for API failed.');
        }

        // Insert API data into collection
        const apiId = Apis.insert(apiData);

        // If insert failed, stop and send response
        if (!apiId) {
          return errorMessagePayload(500, 'Insert API card into database failed.');
        }

        // Add also documentation, if links are given
        if (documentationUrl || externalDocumentation) {
          const result = ApiDocs.insert({
            apiId,
            type: 'url',
            remoteFileUrl: documentationUrl,
            otherUrl: [externalDocumentation],
          });
          // Integrity: If insertion of document link failed, remove also API card
          if (result === 0) {
            // Remove newly created API document
            Meteor.call('removeApi', apiId);
            return errorMessagePayload(500, 'Insert documentation failed. API card not created.');
          }
        }

        // Prepare data to response, extend it with Documentation URLs
        const responseData = Object.assign(
          Apis.findOne(apiId),
          { documentationUrl, externalDocumentation });

        // Give user manager role
        Roles.addUsersToRoles(userId, 'manager');

        return {
          statusCode: 201,
          body: {
            status: 'success',
            data: responseData,
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
          ProxyV1.swagger.params.proxyRequest,
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
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Used in case of rollback
        let previousDocumentationUrl;

        // Get data from body parameters
        const bodyParams = this.bodyParams;
        // Get ID of API
        const apiId = this.urlParams.id;
        // Get current user ID
        const userId = this.userId;

        // Find API with specified ID
        const api = Apis.findOne(apiId);

        // API doesn't exist
        if (!api) {
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // API exists but user can not manage
        if (!api.currentUserCanManage(userId)) {
          return errorMessagePayload(403, 'You do not have permission for editing this API.');
        }

        // If API name given, check if API with same name already exists
        if (bodyParams.name) {
          const duplicateApi = Apis.findOne({ name: bodyParams.name });

          if (duplicateApi) {
            const detailLine = 'Duplicate: API with same name already exists.';
            return errorMessagePayload(400, detailLine, 'id', duplicateApi._id);
          }

          // Get formed slug
          const slugData = Meteor.call('formSlugFromName', 'Apis', bodyParams.name);
          // Check slugData
          if (slugData && typeof slugData === 'object') {
            // Include slug
            bodyParams.slug = slugData.slug;
            // Include friendlySlugs
            bodyParams.friendlySlugs = slugData.friendlySlugs;
          } else {
            return errorMessagePayload(500, 'Forming slug for API failed!');
          }
        }

        // validate values
        const validateFields = {
          description: bodyParams.description,
          lifecycleStatus: bodyParams.lifecycleStatus,
        };

        // Description must not exceed field length in DB
        if (bodyParams.description) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }

        // Is value of lifecycle status allowed
        if (bodyParams.lifecycleStatus) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        const isPublicParam = bodyParams.isPublic;

        if (isPublicParam) {
          if (isPublicParam === 'true') {
            bodyParams.isPublic = true;
          } else if (isPublicParam === 'false') {
            bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }
        // Check if link for openAPI documentation was given
        const documentationUrl = bodyParams.documentationUrl;
        // Check if link for external documentation was given
        const externalDocumentation = bodyParams.externalDocumentation;

        if (documentationUrl || externalDocumentation) {
          // Try to fetch existing documentation
          const apiDoc = ApiDocs.findOne({ apiId });
          // Regex for http(s) protocol
          const regex = SimpleSchema.RegEx.Url;

          // Check link to Documentation URL
          if (documentationUrl) {
            // Check link validity
            if (!regex.test(documentationUrl)) {
              // Error message
              const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
              return errorMessagePayload(400, message);
            }
          }

          // Check link to an external documentation
          if (externalDocumentation) {
            // Check link validity
            if (!regex.test(externalDocumentation)) {
              // Error message
              const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
              return errorMessagePayload(400, message);
            }

            // Check if new external documentation link can be added
            if (apiDoc && apiDoc.otherUrl) {
              // Can not add same link again
              const isLinkAlreadyPresent = apiDoc.otherUrl.includes(externalDocumentation);
              if (isLinkAlreadyPresent) {
                const message = 'Same link to "externalDocumentation" already exists.';
                return errorMessagePayload(400, message, 'url', externalDocumentation);
              }
              // Max 8 external documentation links can be added
              if (apiDoc.otherUrl.length > 7) {
                const message = 'Maximum number of external documentation links (8) already given.';
                return errorMessagePayload(400, message);
              }
            }
            // Prepare for rollback of openAPI documentation after possible failure
            if (apiDoc && apiDoc.remoteFileUrl) {
              previousDocumentationUrl = apiDoc.remoteFileUrl;
            }
          }

          // Update Documentation (or create a new one)
          const result = ApiDocs.update(
            { apiId },
            { $set: {
              type: 'url',
              remoteFileUrl: bodyParams.documentationUrl,
            },
              $push: { otherUrl: bodyParams.externalDocumentation } },
            // If apiDocs document did not exist, create a new one
            { upsert: true },
          );
          // If update/insert of document link(s) failed
          if (result === 0) {
            return errorMessagePayload(500, 'Update failed because Documentation update fail.');
          }
        }

        // Include user ID here so it can be filled to DB correspondingly
        // Note! Meteor.userId is not available!
        bodyParams.updated_by = userId;

        // Update API document
        const result = Apis.update(apiId, { $set: bodyParams });
        // Check if API update failed
        if (result === 0) {
          // Try to rollback documentation update, if necessary
          if (documentationUrl || externalDocumentation) {
            if (documentationUrl) {
              // Restore previous openAPI documentation link, if it exists
              if (previousDocumentationUrl) {
                ApiDocs.update(
                  { apiId },
                  { $set: {
                    type: 'url',
                    remoteFileUrl: previousDocumentationUrl,
                  },
                  },
              );
              } else {
                // No previous link, just make it empty
                ApiDocs.update(
                  { apiId },
                  { $unset: {
                    remoteFileUrl: '',
                  },
                  },
                );
              }
            }
            // Rollback external documentation by removing latest added link
            if (externalDocumentation) {
              ApiDocs.update(
                { apiId },
                { $set: {
                  type: 'url',
                },
                  $pull: { otherUrl: externalDocumentation } },
              );
            }
          }
          return errorMessagePayload(500, 'Update failed because API update fail.');
        }

        // Prepare data to response, extend it with Documentation URLs
        const responseData = Object.assign(
          // Get updated value of API
          Apis.findOne(apiId),
          // Get updated values of Documentation urls
          {
            externalDocumentation: api.otherUrl(),
            documentationUrl: api.documentationUrl(),
          });


        // Instead of API URL, return API Proxy's URL, if it exists
        const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

        // If Proxy is API Umbrella, fill in proxy URL
        if (proxyBackend && proxyBackend.type === 'apiUmbrella') {
          // Get connected proxy url
          const proxyUrl = proxyBackend.proxyUrl();
          // Get proxy backend path
          const frontendPrefix = proxyBackend.frontendPrefix();
          // Display also actual API URL
          responseData.backendURL = responseData.url;
          responseData.backendPrefix = proxyBackend.backendPrefix();

          // Get name of proxy
          const proxy = Proxies.findOne(proxyBackend.proxyId);
          if (proxy) {
            responseData.proxyName = proxy.name;
            responseData.proxyType = proxy.type;
          }

          // Provide full proxy path
          responseData.url = proxyUrl.concat(frontendPrefix);
        }

        // OK response with API data
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: responseData,
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
    authRequired: false,
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
                $ref: '#/definitions/proxyResponse',
              },
            },
          },
        },
        204: {
          description: 'No data to return',
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

