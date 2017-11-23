/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import CatalogV1 from '/apinf_packages/rest_apis/server/catalog';
import Organizations from '/apinf_packages/organizations/collection';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionApis from '/apinf_packages/rest_apis/lib/descriptions/apis_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

CatalogV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

// Request /rest/v1/apis for Apis collection
CatalogV1.addCollection(Apis, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Response contains a list of all public entities within the collection
    getAll: {
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'List and search public API.',
        description: descriptionApis.getAll,
        parameters: [
          CatalogV1.swagger.params.optionalSearch,
          CatalogV1.swagger.params.organizationApi,
          CatalogV1.swagger.params.skip,
          CatalogV1.swagger.params.limit,
          CatalogV1.swagger.params.lifecycle,
          CatalogV1.swagger.params.managedAPIs,
        ],
        responses: {
          200: {
            description: 'List of APIs',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/apiResponse',
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
          },
        },
      },
      action () {
        const queryParams = this.queryParams;
        let query = { };

        // Get Manager ID from header
        const managerId = this.request.headers['x-user-id'];

        // Check if requestor is administrator
        const requestorIsAdmin = Roles.userIsInRole(managerId, ['admin']);

        if (!requestorIsAdmin) {
          // Only Public APIs are available for unregistered user
          query = { isPublic: true };
        }

        const options = {};

        // Get APIs managed by user requesting operation
        if (queryParams.managedAPIs === 'true') {
          // Response with error in case managerId is missing from header
          if (!managerId) {
            return errorMessagePayload(400, 'Manager ID expected in header (X-User-Id).');
          }

          // Set condition for a list of managed APIs
          query.managerIds = managerId;
        }

        // Parse query parameters
        if (queryParams.organization) {
          // Get organization document with specified ID
          const organization = Organizations.findOne(queryParams.organization);

          // Make sure Organization exists
          if (!organization) {
            return errorMessagePayload(400, 'Bad query parameters. Organization not found.');
          }
          // Get list of managed API IDs
          query._id = { $in: organization.managedApiIds() };
        }

        if (queryParams.lifecycle) {
          // Convert lifecycle value to lower case
          const lifecycle = queryParams.lifecycle.toLowerCase();

          // Structure for validating values against schema
          const validateFields = {
            lifecycleStatus: lifecycle,
          };

          // Validate lifecycleStatus
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycle has erroneous value.');
          }

          query.lifecycleStatus = lifecycle;
        }

        if (queryParams.limit) {
          // Make sure limit parameters only accept integer
          const limit = parseInt(queryParams.limit, 10);

          if (!Number.isInteger(limit)) {
            return errorMessagePayload(400,
              'Bad query parameters value. Limit parameters only accept integer.');
          }
          options.limit = limit;
        }

        if (queryParams.skip) {
          // Make sure skip parameters only accept integer
          const skip = parseInt(queryParams.skip, 10);
          if (!Number.isInteger(skip)) {
            return errorMessagePayload(400,
              'Bad query parameters value. Skip parameters only accept integer.');
          }
          options.skip = skip;
        }

        // Pass an optional search string for looking up inventory.
        if (queryParams.q) {
          query.$or = [
            {
              name: {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
            {
              description: {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
          ];
        }

        // Create new API list that is based on APIs collection with extended field logoUrl
        const apiList = Apis.find(query, options).map((api) => {
          // Make sure logo is uploaded
          if (api.apiLogoFileId) {
            // Create a new field to store logo URL
            api.logoUrl = api.logoUrl();
          }

          // Instead of API URL, return API Proxy's URL, if it exists
          const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

          // If Proxy is API Umbrella
          if (proxyBackend && proxyBackend.type === 'apiUmbrella') {
            // Get connected proxy url
            const proxyUrl = proxyBackend.proxyUrl();
            // Get proxy backend path
            const frontendPrefix = proxyBackend.frontendPrefix();
            // Provide full proxy path
            api.url = proxyUrl.concat(frontendPrefix);
          }

          // Get URl of Swagger specification
          api.documentationUrl = api.documentationUrl();
          // Get URL to external site with API documentation
          api.externalDocumentation = api.otherUrl();

          return api;
        });

        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: apiList,
          },
        };
      },
    },
    // Response contains the entity with the given :id
    get: {
      authRequired: false,
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Fetch API with specified ID.',
        description: descriptionApis.get,
        parameters: [
          CatalogV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'API found successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
                },
              },
            },
          },
          204: {
            description: 'No data to return',
          },
          404: {
            description: 'API is not Found',
          },
        },
      },
      action () {
        const apiId = this.urlParams.id;

        // Fetch the API matching with condition
        const api = Apis.findOne({ _id: apiId });
        // Return error response, it API is not found.
        if (!api) {
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // Only Public APIs are available for non-admin/non-manager user
        if (api.isPublic === false) {
          let displayPrivateAPI = false;
          // Get requestor ID from header
          const requestorId = this.request.headers['x-user-id'];

          if (requestorId) {
            // Check if requestor is administrator
            const requestorIsAdmin = Roles.userIsInRole(requestorId, ['admin']);
            // Check if requestor is manager
            const requestorIsManager = api.currentUserCanManage(requestorId);
            displayPrivateAPI = requestorIsAdmin || requestorIsManager;
          }
          if (!displayPrivateAPI) {
            return {
              statusCode: 204,
              body: {
                status: 'success',
              },
            };
          }
        }

        // Extend API structure with correct link to API logo
        if (api.apiLogoFileId) {
          api.logoUrl = api.logoUrl();
        }

        // Instead of API URL, return API Proxy's URL, if it exists
        const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

        // If Proxy is API Umbrella, fill in proxy URL
        if (proxyBackend && proxyBackend.type === 'apiUmbrella') {
          // Get connected proxy url
          const proxyUrl = proxyBackend.proxyUrl();
          // Get proxy backend path
          const frontendPrefix = proxyBackend.frontendPrefix();
          // Provide full proxy path
          api.url = proxyUrl.concat(frontendPrefix);
        }

        // Get URl of Swagger specification
        api.documentationUrl = api.documentationUrl();
        // Get URL to external site with API documentation
        api.externalDocumentation = api.otherUrl();

        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: api,
          },
        };
      },
    },
    // Create a new API
    post: {
      authRequired: true,
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Add new API to catalog.',
        description: descriptionApis.post,
        parameters: [
          CatalogV1.swagger.params.api,
        ],
        responses: {
          201: {
            description: 'API added successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
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

        // structure for validating values against schema
        const validateFields = {
          name: bodyParams.name,
          url: bodyParams.url,
          description: bodyParams.description,
          lifecycleStatus: bodyParams.lifecycleStatus,
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
        if (Apis.findOne({ name: bodyParams.name })) {
          return errorMessagePayload(400, 'Duplicate: API with same name already exists.');
        }


        // Description must not exceed field length in DB
        if (bodyParams.description) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
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

        // Documentation URL must have URL format
        if (documentationUrl) {
          isValid = ApiDocs.simpleSchema().namedContext()
            .validateOne({ remoteFileUrl: documentationUrl }, 'remoteFileUrl');

          if (!isValid) {
            // Error message
            const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Link to an external site must have URL format
        if (externalDocumentation) {
          isValid = ApiDocs.simpleSchema().namedContext()
            .validateOne({ otherUrl: externalDocumentation }, 'otherUrl');

          if (!isValid) {
            // Error message
            const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Add manager IDs list into
        const apiData = Object.assign({ managerIds: [userId] }, bodyParams);

        // Insert API data into collection
        const apiId = Apis.insert(apiData);

        // Did insert fail
        if (!apiId) {
          return errorMessagePayload(500, 'Inserting API into database failed.');
        }


        // Make sure a user provides some Documentation data & API is created
        if (documentationUrl || externalDocumentation) {
          ApiDocs.insert({
            apiId,
            type: 'url',
            otherUrl: externalDocumentation,
            remoteFileUrl: documentationUrl,
          });
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
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Update API.',
        description: descriptionApis.put,
        parameters: [
          CatalogV1.swagger.params.apiId,
          CatalogV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API updated successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
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

        const documentationUrl = bodyParams.documentationUrl;
        const externalDocumentation = bodyParams.externalDocumentation;

        // Documentation URL must have URL format
        if (documentationUrl) {
          const isValid = ApiDocs.simpleSchema().namedContext()
            .validateOne({ remoteFileUrl: documentationUrl }, 'remoteFileUrl');

          if (!isValid) {
            // Error message
            const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Link to an external site must have URL format
        if (externalDocumentation) {
          const isValid = ApiDocs.simpleSchema().namedContext()
            .validateOne({ otherUrl: externalDocumentation }, 'otherUrl');

          if (!isValid) {
            // Error message
            const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        const apiDoc = ApiDocs.findOne({ apiId });

        // Make sure a user provides Documentation data & API is created
        if (apiDoc && (documentationUrl || externalDocumentation)) {
          ApiDocs.update(
            { apiId },
            { $set: {
              type: 'url',
              remoteFileUrl: bodyParams.documentationUrl,
              otherUrl: bodyParams.externalDocumentation,
            },
            });
        }

        // API doesn't have documentation yet and Documentation data is provided
        if (!apiDoc && (documentationUrl || externalDocumentation)) {
          // Create a new apiDoc instance
          ApiDocs.insert({
            apiId,
            type: 'url',
            otherUrl: bodyParams.externalDocumentation,
            remoteFileUrl: bodyParams.documentationUrl,
          });
        }

        // Update API document
        const apiUpdate = Apis.update(apiId, { $set: bodyParams });

        // Did update fail
        if (!apiUpdate) {
          return errorMessagePayload(500, 'Updating API into database failed.');
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
    // Remove an API
    delete: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Delete API.',
        description: descriptionApis.delete,
        parameters: [
          CatalogV1.swagger.params.apiId,
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
        // Get ID of API
        const apiId = this.urlParams.id;
        // Get User ID
        const userId = this.userId;
        // Get API document
        const api = Apis.findOne(apiId);

        // API must exist
        if (!api) {
          // API doesn't exist
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // User must be able to manage API
        if (!api.currentUserCanManage(userId)) {
          return errorMessagePayload(403, 'User does not have permission to remove this API.');
        }

        // Remove API document
        Meteor.call('removeApi', api._id);

        // No content with 204
        return {
          statusCode: 204,
          body: {
            status: 'success',
            message: 'API removed',
          },
        };
      },
    },
  },
});
