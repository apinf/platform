/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import URI from 'urijs';
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import { proxyBasePathRegEx,
         apiBasePathRegEx } from '/apinf_packages/proxy_backends/collection/regex';
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
    // Show information of all APIs
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
                  example: 'success',
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

            // Admin can see also actual API URL
            if (requestorIsAdmin) {
              api.backendURL = api.url;
              api.backendPrefix = proxyBackend.backendPrefix();
              // Get name and type of proxy
              const proxy = Proxies.findOne(proxyBackend.proxyId);
              if (proxy) {
                api.proxyName = proxy.name;
                api.proxyType = proxy.type;
              }
            }

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
    // Show information of an identified API
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

        // Check if user is Admin or Manager
        let userCanManage = false;
        // Get requestor ID from header
        const requestorId = this.request.headers['x-user-id'];

        if (requestorId) {
          // Check if requestor is administrator
          const requestorIsAdmin = Roles.userIsInRole(requestorId, ['admin']);
          // Check if requestor is manager
          const requestorIsManager = api.currentUserCanManage(requestorId);
          userCanManage = requestorIsAdmin || requestorIsManager;
        }

        // Only Public APIs are available for non-admin/non-manager user
        if (api.isPublic === false) {
          if (!userCanManage) {
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

          // Manager can see also actual API URL
          if (userCanManage) {
            api.backendURL = api.url;
            api.backendPrefix = proxyBackend.backendPrefix();

            // Get name and type of proxy
            const proxy = Proxies.findOne(proxyBackend.proxyId);
            if (proxy) {
              api.proxyName = proxy.name;
              api.proxyType = proxy.type;
            }
          }

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
                  example: 'success',
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

        // Include also user ID into DB
        bodyParams.created_by = userId;

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
        const duplicateApi = Apis.findOne({ name: bodyParams.name });

        if (duplicateApi) {
          const detailLine = 'Duplicate: API with same name already exists.';
          return errorMessagePayload(400, detailLine, 'id', duplicateApi._id);
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
    // Modify identified API
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
                  example: 'success',
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

// Request /rest/v1/apis/:id/documents/
CatalogV1.addRoute('apis/:id/documents', {
  // Remove documentation from given API (:id) either completely or partially
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Delete identified documentation or all documentation.',
      description: descriptionApis.deleteDocumentation,
      parameters: [
        CatalogV1.swagger.params.apiId,
        CatalogV1.swagger.params.url,
      ],
      responses: {
        200: {
          description: 'API documentation updated successfully',
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
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Check if documentation exists
      const apiDoc = ApiDocs.findOne({ apiId });

      if (!apiDoc) {
        return errorMessagePayload(404, 'No documentation exists for this API.');
      }

      // Check if link for openAPI documentation was given
      const documentUrl = this.queryParams.url;

      // Remove identified documentation link
      if (documentUrl) {
        // Check if it is openAPI documentation or external documentation link
        if (documentUrl === apiDoc.remoteFileUrl) {
          // Matching link found as openAPI documentatin, try to remove
          const removeResult = ApiDocs.update(
            { apiId },
            { $unset: {
              remoteFileUrl: '',
            },
            },
          );
          // If removal of openAPI document link failed
          if (removeResult === 0) {
            const message = 'OpenAPI Documentation link removal failure.';
            return errorMessagePayload(500, message, 'url', documentUrl);
          }
        } else if (apiDoc.otherUrl.includes(documentUrl)) {
          // Matching link found as external documentatin, try to remove
          const removeResult = ApiDocs.update(
            { apiId },
            { $pull: { otherUrl: documentUrl } },
          );
          // If removal of external document link failed
          if (removeResult === 0) {
            const message = 'External Documentation link removal failure.';
            return errorMessagePayload(500, message, 'url', documentUrl);
          }
        } else {
          // No matching link found
          const message = 'Documentation link match not found.';
          return errorMessagePayload(404, message, 'url', documentUrl);
        }
      } else {
        // Remove all documentation, because no link identified
        Meteor.call('removeApiDoc', apiId);
      }

      // Prepare data to response, extend it with Documentation URLs
      const responseData = Object.assign(
        // API has not changed, use already fetched value
        api,
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
});

// Request /rest/v1/apis/:id/proxyBackend/
CatalogV1.addRoute('apis/:id/proxyBackend', {
  // Show information of API's proxy connection
  get: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Show Proxy connection of an API.',
      description: descriptionApis.getProxyBackend,
      parameters: [
        CatalogV1.swagger.params.apiId,
      ],
      responses: {
        200: {
          description: 'Proxy connection exists for this API',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/proxyConnectionResponse',
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
      // Get ID of API (URL parameter)
      const apiId = this.urlParams.id;
      // Get User ID
      const userId = this.userId;

      // API related checkings
      // Get API document
      const api = Apis.findOne(apiId);

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // User must be able to manage API
      if (!api.currentUserCanManage(userId)) {
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Get API's Proxy connection data
      const proxyBackend = ProxyBackends.findOne({ apiId });
      if (!proxyBackend) {
        // The Proxy backend doesn't exist
        return errorMessagePayload(404, 'Proxy connection for the API is not found.');
      }

      // OK response with Proxy backend data
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: proxyBackend,
        },
      };
    },
  },
  // Connect given API to a given proxy
  post: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Connect an API to a proxy.',
      description: descriptionApis.postProxyBackend,
      parameters: [
        CatalogV1.swagger.params.apiId,
        CatalogV1.swagger.params.proxyConnectionRequestPost,
      ],
      responses: {
        200: {
          description: 'API connected to a Proxy successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/proxyConnectionResponse',
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
      // Get ID of API (URL parameter)
      const apiId = this.urlParams.id;
      // Get User ID
      const userId = this.userId;

      // API related checkings
      // Get API document
      const api = Apis.findOne(apiId);

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // User must be able to manage API
      if (!api.currentUserCanManage(userId)) {
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Check if the API is already connected to a Proxy
      const existingProxyBackend = ProxyBackends.findOne({ apiId });
      if (existingProxyBackend) {
        // The Proxy backend already exist
        return errorMessagePayload(400, 'Proxy connection for the API already exist.');
      }

      // Get body parameters
      const bodyParams = this.bodyParams;
      // At least one parameter has to be given
      if (!Object.keys(bodyParams).length) {
        return errorMessagePayload(400, 'No parameters given.');
      }

      // Proxy related checkings
      // proxyId is a required field
      if (!bodyParams.proxyId) {
        return errorMessagePayload(400, 'Parameter "proxyId" is mandatory.');
      }

      // Get proxy document
      const proxy = Proxies.findOne(bodyParams.proxyId);

      // proxy must exist
      if (!proxy) {
        return errorMessagePayload(404, 'Proxy with specified ID is not found.');
      }

      // Collect data to be inserted into proxyBackend
      const newProxyBackendData = {
        apiId,
        proxyId: proxy._id,
        // Type comes from selected proxy
        type: proxy.type,
      };

      if (proxy.type === 'apiUmbrella') {
        // frontendPrefix is a required field
        if (!bodyParams.frontendPrefix) {
          return errorMessagePayload(400, 'Parameter "frontendPrefix" is mandatory.');
        }

        // Validation of frontendPrefix
        if (!proxyBasePathRegEx.test(bodyParams.frontendPrefix)) {
          return errorMessagePayload(400, 'Parameter "frontendPrefix" not valid.',
          'frontendPrefix', bodyParams.frontendPrefix);
        }

        // Check if given frontend_prefix is already in use
        const duplicateFEPrefix = ProxyBackends.findOne({
          'apiUmbrella.url_matches.frontend_prefix': bodyParams.frontendPrefix,
        });
        if (duplicateFEPrefix) {
          return errorMessagePayload(400, 'Parameter "frontendPrefix" must be unique.');
        }

        const frontendPrefix = bodyParams.frontendPrefix;

        // backendPrefix is a required field
        if (!bodyParams.backendPrefix) {
          return errorMessagePayload(400, 'Parameter "backendPrefix" is mandatory.');
        }

        // Validation of backendPrefix
        if (!apiBasePathRegEx.test(bodyParams.backendPrefix)) {
          return errorMessagePayload(400, 'Parameter "backendPrefix" not valid.',
          'backendPrefix', bodyParams.backendPrefix);
        }
        const backendPrefix = bodyParams.backendPrefix;

        // Collect prefixes
        const urlMatches = [{
          frontend_prefix: frontendPrefix,
          backend_prefix: backendPrefix,
        }];

        // Prepare apiUmbrella object
        const apiUmbrella = {};

        // Get API details from API document
        apiUmbrella.name = api.name;

        // Frontend host address comes from proxy document
        const apiUmbrellaUrl = new URI(proxy.apiUmbrella.url);
        apiUmbrella.frontend_host = apiUmbrellaUrl.host();

        // Backend host address comes from API
        const apiUrl = new URI(api.url);
        apiUmbrella.backend_host = apiUrl.host();
        apiUmbrella.backend_protocol = apiUrl.protocol();

        // Information of server address and port
        // By default apiPort is set to 443 for https
        let apiPort = 443;
        // Default apiPort for https is 80
        if (apiUmbrella.backend_protocol === 'http') {
          apiPort = 80;
        }
        // apiPort must be a numeric value
        if (bodyParams.apiPort) {
          if (isNaN(bodyParams.apiPort) || bodyParams.apiPort < 0 || bodyParams.apiPort > 65535) {
            return errorMessagePayload(400, 'Parameter "apiPort" has erroneous value.',
            'apiPort', bodyParams.apiPort);
          }
          apiPort = bodyParams.apiPort;
        }

        const servers = [{
          host: apiUrl.host(),
          port: apiPort,
        }];

        // Prepare and fill settings object
        const settings = {};

        // If disableApiKey is given, it can be only literal true/false
        if (bodyParams.disableApiKey) {
          const allowedDisableApiKeyValues = ['false', 'true'];
          if (!allowedDisableApiKeyValues.includes(bodyParams.disableApiKey)) {
            return errorMessagePayload(400, 'Parameter "disableApiKey" has erroneous value.',
            'disableApiKey', bodyParams.disableApiKey);
          }
        }

        // Convert given value to boolean. Also sets default false, if value not given.
        settings.disable_api_key = (bodyParams.disableApiKey === 'true');

        // Rate limit modes, default value is unlimited
        settings.rate_limit_mode = bodyParams.rateLimitMode || 'unlimited';
        const allowedRateLimitModeValues = ['custom', 'unlimited'];

        // Is Rate limit mode allowed value
        if (!allowedRateLimitModeValues.includes(settings.rate_limit_mode)) {
          return errorMessagePayload(400, 'Parameter "rateLimitMode" has erroneous value.',
          'rateLimitMode', bodyParams.rateLimitMode);
        }

        // When rate_limit_mode is 'custom', also additional parameters can be given
        if (settings.rate_limit_mode === 'custom') {
          // duration must be a numeric value
          if (bodyParams.duration) {
            if (isNaN(bodyParams.duration) || bodyParams.duration < 0) {
              return errorMessagePayload(400, 'Parameter "duration" has erroneous value.',
              'duration', bodyParams.duration);
            }
          }

          // Is limitBy allowed value
          if (bodyParams.limitBy) {
            const allowedRateLimitByValues = ['apiKey', 'ip'];
            if (!allowedRateLimitByValues.includes(bodyParams.limitBy)) {
              return errorMessagePayload(400, 'Parameter "limitBy" has erroneous value.',
              'limitBy', bodyParams.limitBy);
            }
          }

          // limit must be a numeric value
          if (bodyParams.limit) {
            if (isNaN(bodyParams.limit) || bodyParams.limit < 0) {
              return errorMessagePayload(400, 'Parameter "limit" has erroneous value.',
              'limit', bodyParams.limit);
            }
          }

          // If disableApiKey is given, it can be only literal true/false
          if (bodyParams.showLimit) {
            const allowedshowLimitValues = ['false', 'true'];
            if (!allowedshowLimitValues.includes(bodyParams.showLimit)) {
              return errorMessagePayload(400, 'Parameter "showLimit" has erroneous value.',
              'showLimit', bodyParams.showLimit);
            }
          }

          // Convert given value to boolean. Also sets default false, if value not given.
          const showLimitInResponseHeaders = (bodyParams.showLimit === 'true');

          // Get given values ready for DB write
          const rateLimits = [{
            duration: bodyParams.duration * 1,
            limit_by: bodyParams.limitBy,
            limit: bodyParams.limit * 1,
            response_headers: showLimitInResponseHeaders,
          }];
          // Add into settings
          settings.rate_limits = rateLimits;
        }

        // Collect apiUmbrella related data
        apiUmbrella.balance_algorithm = 'least_conn';
        apiUmbrella.servers = servers;
        apiUmbrella.url_matches = urlMatches;
        apiUmbrella.settings = settings;

        // Fill the new backend data
        newProxyBackendData.apiUmbrella = apiUmbrella;

        // Insert corresponding proxy backend to apiUmbrella
        const response = Meteor.call('createApiBackendOnApiUmbrella',
          newProxyBackendData.apiUmbrella,
          newProxyBackendData.proxyId);

        // If response has errors object, notify about it
        if (response.errors && response.errors.default) {
          // Notify about error
          return errorMessagePayload(500, response.errors.default[0]);
        }

        // If success, attach API Umbrella backend ID to API
        if (!_.has(response, 'result.data.api')) {
          return errorMessagePayload(500, 'apiUmbrella update failed.');
        }
        // Get the API Umbrella ID for newly created backend
        const umbrellaBackendId = response.result.data.api.id;

        // Attach the API Umbrella backend ID to backend document
        newProxyBackendData.apiUmbrella.id = umbrellaBackendId;

          // Publish the API Backend on API Umbrella
        const publishSuccess = Meteor.call('publishApiBackendOnApiUmbrella',
                      umbrellaBackendId, newProxyBackendData.proxyId);
        if (publishSuccess.errors && response.errors.default) {
          return errorMessagePayload(publishSuccess.errors.http_status,
            publishSuccess.errors.default);
        }

        // Insert the apiUmbrella Proxy Backend document on APInf
        const proxyBackendId = ProxyBackends.insert(newProxyBackendData);
        if (!proxyBackendId) {
          return errorMessagePayload(500, 'Creating proxyBackend failed.');
        }

        // Start cron tasks that run storing Analytics Data to MongoDB
        Meteor.call('calculateAnalyticsData', proxyBackendId);

        // Create a placeholder in 30 days for charts for particular Proxy Backend
        Meteor.call('proxyBackendAnalyticsData', proxyBackendId, 30, 'today');
      } else if (proxy.type === 'emq') {
        // allow is a mandatory field, values 0/1
        if (bodyParams.allow) {
          if (isNaN(bodyParams.allow) || bodyParams.allow < 0 || bodyParams.allow > 1) {
            return errorMessagePayload(400, 'Parameter "allow" has erroneous value.',
            'allow', bodyParams.allow);
          }
        } else {
          return errorMessagePayload(400, 'Parameter "allow" is mandatory.');
        }

        // access is a mandatory field, values 1/2/3
        if (bodyParams.access) {
          if (isNaN(bodyParams.access) || bodyParams.access < 1 || bodyParams.access > 3) {
            return errorMessagePayload(400, 'Parameter "access" has erroneous value.',
            'access', bodyParams.access);
          }
        } else {
          return errorMessagePayload(400, 'Parameter "access" is mandatory.');
        }

        // topic is a mandatory field
        if (!bodyParams.topic) {
          return errorMessagePayload(400, 'Parameter "topic" is mandatory.');
        }

        // fromType is a mandatory field
        if (bodyParams.fromType) {
          const allowedfromTypeValues = ['clientid', 'username', 'ipaddr'];
          if (!allowedfromTypeValues.includes(bodyParams.fromType)) {
            return errorMessagePayload(400, 'Parameter "fromType" has erroneous value.',
            'fromType', bodyParams.fromType);
          }
        } else {
          return errorMessagePayload(400, 'Parameter "fromType" is mandatory.');
        }

        // fromValue is a mandatory field
        if (!bodyParams.fromValue) {
          return errorMessagePayload(400, 'Parameter "fromValue" is mandatory.');
        }

        // structure for inserting new ACL object
        const aclFields = [{
          id: new Meteor.Collection.ObjectID().valueOf(),
          allow: bodyParams.allow,
          access: bodyParams.access,
          topic: bodyParams.topic,
          fromType: bodyParams.fromType,
          fromValue: bodyParams.fromValue,
          proxyId: proxy._id,
        }];

        // Fill the new backend data
        const settings = {};
        settings.acl = aclFields;
        const emq = {};
        emq.settings = settings;
        newProxyBackendData.emq = emq;

        // Insert the emq Proxy Backend document on APInf
        const proxyBackendId = ProxyBackends.insert(newProxyBackendData);
        if (!proxyBackendId) {
          return errorMessagePayload(500, 'Creating proxyBackend failed.');
        }

        // Send ACL settings to EMQ proxy
        const emqResponse = Meteor.call('emqAclRequest',
                                        'POST',
                                        newProxyBackendData.proxyId,
                                        newProxyBackendData.emq.settings.acl);
        // TODO: how to check result of operation and react
      } else {
        return errorMessagePayload(400, 'Unknown proxy type.');
      }

      // Get API's just inserted Proxy connection data for response
      const createdProxyBackend = ProxyBackends.findOne({ apiId });
      if (!createdProxyBackend) {
        // The Proxy backend doesn't exist
        return errorMessagePayload(500, 'Proxy connection for the API is not created.');
      }

      // OK response with API data
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: createdProxyBackend,
        },
      };
    },
  },
  // Modify proxy backend parameters of given API
  put: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Modify Proxy connection parameters of an API.',
      description: descriptionApis.putProxyBackend,
      parameters: [
        CatalogV1.swagger.params.apiId,
        CatalogV1.swagger.params.proxyConnectionRequestPut,
      ],
      responses: {
        200: {
          description: 'Proxy connection parameters modified successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/proxyConnectionResponse',
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
      // Get ID of API (URL parameter)
      const apiId = this.urlParams.id;
      // Get User ID
      const userId = this.userId;

      // API related checkings
      // Get API document
      const api = Apis.findOne(apiId);

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // User must be able to manage API
      if (!api.currentUserCanManage(userId)) {
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Check if the API is connected to a Proxy
      const proxyBackend = ProxyBackends.findOne({ apiId });
      if (!proxyBackend) {
        // The Proxy backend must exist
        return errorMessagePayload(400, 'The API must have a Proxy connection.');
      }

      // _id and apiUmbrella id are not needed
      const proxyBackendId = proxyBackend._id;
      delete proxyBackend._id;
      delete proxyBackend.apiUmbrella.id;

      // Get proxy document
      const proxy = Proxies.findOne(proxyBackend.proxyId);

      // proxy must exist
      if (!proxy) {
        return errorMessagePayload(404, 'Proxy with specified ID is not found.');
      }

      // Get body parameters
      const bodyParams = this.bodyParams;

      // At least one parameter has to be given
      if (!Object.keys(bodyParams).length) {
        return errorMessagePayload(400, 'No parameters given.');
      }

      // For simplicity: either edit or remove at a time
      if (bodyParams.editIndex && bodyParams.removeIndex) {
        return errorMessagePayload(400, 'Only editIndex or removeIndex can be given at a time.');
      }

      // Functionality related to proxy type
      //           apiUmbrella
      // -----------------------------------
      if (proxyBackend.type === 'apiUmbrella') {
        // No changes to emq part here
        delete proxyBackend.emq;

        // is frontendPrefix given
        if (bodyParams.frontendPrefix) {
          // Validation of frontendPrefix
          if (!proxyBasePathRegEx.test(bodyParams.frontendPrefix)) {
            return errorMessagePayload(400, 'Parameter "frontendPrefix" not valid.',
            'frontendPrefix', bodyParams.frontendPrefix);
          }
          // Check if given frontend_prefix is already in use
          const duplicateFEPrefix = ProxyBackends.findOne({
            'apiUmbrella.url_matches.frontend_prefix': bodyParams.frontendPrefix,
          });
          if (duplicateFEPrefix) {
            return errorMessagePayload(400, 'Parameter "frontendPrefix" must be unique.');
          }
          proxyBackend.apiUmbrella.url_matches[0].frontend_prefix = bodyParams.frontendPrefix;
          delete bodyParams.frontendPrefix;
        }

        // is backendPrefix given
        if (bodyParams.backendPrefix) {
          // Validation of backendPrefix
          if (!apiBasePathRegEx.test(bodyParams.backendPrefix)) {
            return errorMessagePayload(400, 'Parameter "backendPrefix" not valid.',
            'backendPrefix', bodyParams.backendPrefix);
          }
          proxyBackend.apiUmbrella.url_matches[0].backend_prefix = bodyParams.backendPrefix;
          delete bodyParams.backendPrefix;
        }

        // Get API details from API document
        proxyBackend.apiUmbrella.name = api.name;

        // Frontend host address comes from proxy document
        const apiUmbrellaUrl = new URI(proxy.apiUmbrella.url);
        proxyBackend.apiUmbrella.frontend_host = apiUmbrellaUrl.host();

        // Backend host address comes from API
        const apiUrl = new URI(api.url);
        proxyBackend.apiUmbrella.backend_host = apiUrl.host();
        proxyBackend.apiUmbrella.backend_protocol = apiUrl.protocol();

        // apiPort must be a numeric value
        if (bodyParams.apiPort) {
          if (isNaN(bodyParams.apiPort) || bodyParams.apiPort < 0 || bodyParams.apiPort > 65535) {
            return errorMessagePayload(400, 'Parameter "apiPort" has erroneous value.',
            'apiPort', bodyParams.apiPort);
          }
          proxyBackend.apiUmbrella.servers[0].port = 1 * bodyParams.apiPort;
          delete bodyParams.apiPort;
        }
        proxyBackend.apiUmbrella.servers[0].host = apiUrl.host();

        // If disableApiKey is given, it can be only literal true/false
        if (bodyParams.disableApiKey) {
          const allowedDisableApiKeyValues = ['false', 'true'];
          if (!allowedDisableApiKeyValues.includes(bodyParams.disableApiKey)) {
            return errorMessagePayload(400, 'Parameter "disableApiKey" has erroneous value.',
            'disableApiKey', bodyParams.disableApiKey);
          }
          // Convert given value to boolean. Also sets default false, if value not given.
          proxyBackend.apiUmbrella.settings.disable_api_key = (bodyParams.disableApiKey === 'true');
          delete bodyParams.disableApiKey;
        }

        // Is rateLimitMode given with correct value
        if (bodyParams.rateLimitMode) {
          const allowedRateLimitModeValues = ['custom', 'unlimited'];
          // Is Rate limit mode allowed value
          if (!allowedRateLimitModeValues.includes(bodyParams.rateLimitMode)) {
            return errorMessagePayload(400, 'Parameter "rateLimitMode" has erroneous value.',
            'rateLimitMode', bodyParams.rateLimitMode);
          }
          proxyBackend.apiUmbrella.settings.rate_limit_mode = bodyParams.rateLimitMode;
          delete bodyParams.rateLimitMode;
        }

        // In case rate limits are modified, also index to point to changed object is needed
        if (bodyParams.editIndex) {
          if (!bodyParams.duration &&
              !bodyParams.limitBy &&
              !bodyParams.limit &&
              !bodyParams.showLimit) {
            return errorMessagePayload(400, 'At least one rate parameter needed with editIndex');
          }
        }

        if (!bodyParams.editIndex) {
          if (bodyParams.duration ||
              bodyParams.limitBy ||
              bodyParams.limit ||
              bodyParams.showLimit) {
            return errorMessagePayload(400, 'editIndex is needed with rate parameters');
          }
        }
        // Count number of rate limits currently in DB
        let countOfRates = 0;
        if (proxyBackend.apiUmbrella.settings.rate_limits) {
          countOfRates = proxyBackend.apiUmbrella.settings.rate_limits.length;
        }

        // Is the editIndex given
        if (bodyParams.editIndex) {
          // Rate limits can be modified only in case rate limit mode is 'custom'
          if (proxyBackend.apiUmbrella.settings.rate_limit_mode !== 'custom') {
            return errorMessagePayload(400, 'Rate parameters allowed only when mode is custom');
          }

          // Prepare index
          const rlIndex = 1 * bodyParams.editIndex;

          // Does the rate limit index have correct value
          if (isNaN(rlIndex) || rlIndex < 0 || rlIndex > countOfRates) {
            const detailLine = `Allowed range for 'editIndex' is 0 - ${countOfRates}`;
            return errorMessagePayload(400, detailLine, 'editIndex', rlIndex);
          }

          // Prepare rate_limits object
          let rateLimits = {};
          // if the rate limits object exists, it is used as a basis
          if (proxyBackend.apiUmbrella.settings.rate_limits[rlIndex]) {
            rateLimits = proxyBackend.apiUmbrella.settings.rate_limits[rlIndex];
          } else if (!bodyParams.duration ||
                     !bodyParams.limitBy ||
                     !bodyParams.limit ||
                     !bodyParams.showLimit) {
            const detailLine = 'All rate parameters needed when adding a new rate set';
            return errorMessagePayload(400, detailLine);
          }

          // duration must be a numeric value
          if (bodyParams.duration) {
            if (isNaN(bodyParams.duration) || bodyParams.duration < 0) {
              return errorMessagePayload(400, 'Parameter "duration" has erroneous value.',
              'duration', bodyParams.duration);
            }
            rateLimits.duration = bodyParams.duration * 1;
            delete bodyParams.duration;
          }

          // Is limitBy allowed value
          if (bodyParams.limitBy) {
            const allowedRateLimitByValues = ['apiKey', 'ip'];
            if (!allowedRateLimitByValues.includes(bodyParams.limitBy)) {
              return errorMessagePayload(400, 'Parameter "limitBy" has erroneous value.',
              'limitBy', bodyParams.limitBy);
            }
            rateLimits.limit_by = bodyParams.limitBy;
            delete bodyParams.limitBy;
          }

          // limit must be a numeric value
          if (bodyParams.limit) {
            if (isNaN(bodyParams.limit) || bodyParams.limit < 0) {
              return errorMessagePayload(400, 'Parameter "limit" has erroneous value.',
              'limit', bodyParams.limit);
            }
            rateLimits.limit = 1 * bodyParams.limit;
            delete bodyParams.limit;
          }

          // If disableApiKey is given, it can be only literal true/false
          if (bodyParams.showLimit) {
            const allowedshowLimitValues = ['false', 'true'];
            if (!allowedshowLimitValues.includes(bodyParams.showLimit)) {
              return errorMessagePayload(400, 'Parameter "showLimit" has erroneous value.',
              'showLimit', bodyParams.showLimit);
            }
            // Convert given value to boolean. Also sets default false, if value not given.
            rateLimits.response_headers = (bodyParams.showLimit === 'true');
            delete bodyParams.showLimit;
          }

          proxyBackend.apiUmbrella.settings.rate_limits[rlIndex] = rateLimits;
          delete bodyParams.editIndex;
        }

        // Check if correct value is given for remove index
        if (bodyParams.removeIndex) {
          // Rate limits can be removed only in case rate limit mode is 'custom'
          if (proxyBackend.apiUmbrella.settings.rate_limit_mode !== 'custom') {
            return errorMessagePayload(400, 'Rate set removal allowed only when mode is custom');
          }

          // Prepare index
          const removeIndex = 1 * bodyParams.removeIndex;

          // Does the rate limit remove index have correct value
          if (isNaN(removeIndex) || removeIndex < 0 || removeIndex > countOfRates) {
            const detailLine = `Allowed range for 'removeIndex' is 0 - ${countOfRates - 1}`;
            return errorMessagePayload(400, detailLine, 'removeIndex', removeIndex);
          }
          // find the rate limits object
          if (!proxyBackend.apiUmbrella.settings.rate_limits[removeIndex]) {
            const detailLine = 'Rate limit object does not exist';
            return errorMessagePayload(400, detailLine);
          }

          // Remove the indicated rate limit object
          proxyBackend.apiUmbrella.settings.rate_limits.splice(removeIndex, 1);
          delete bodyParams.removeIndex;
        }
        // Functionality related to proxy type
        //              EMQ
        // -----------------------------------
      } else if (proxyBackend.type === 'emq') {
        // No changes to apiUmbrella part here
        delete proxyBackend.apiUmbrella;

        // In EMQ case either one of indices must be given
        if (!bodyParams.editIndex && !bodyParams.removeIndex) {
          return errorMessagePayload(400, 'Either editIndex or removeIndex must be given.');
        }

        // Count number of ACL objects in DB
        const countOfACL = proxyBackend.emq.settings.acl.length || 0;

        // Modification of ACL data
        if (bodyParams.editIndex) {
          // Prepare index
          const ACLIndex = 1 * bodyParams.editIndex;

          // Does the ACL index have correct value
          if (isNaN(ACLIndex) || ACLIndex < 0 || ACLIndex > countOfACL) {
            const detailLine = `Allowed range for 'editIndex' is 0 - ${countOfACL}`;
            return errorMessagePayload(400, detailLine, 'editIndex', ACLIndex);
          }

          if (!bodyParams.allow &&
              !bodyParams.access &&
              !bodyParams.topic &&
              !bodyParams.fromType &&
              !bodyParams.fromValue) {
            return errorMessagePayload(400, 'At least one ACL parameter needed with editIndex');
          }

          // Prepare ACL object to be modified or added
          let aclFields = {};
          // if the ACL object exists, it is used as a basis
          if (proxyBackend.emq.settings.acl[ACLIndex]) {
            aclFields = proxyBackend.emq.settings.acl[ACLIndex];
          } else if (!bodyParams.allow ||
                      !bodyParams.access ||
                      !bodyParams.topic ||
                      !bodyParams.fromType ||
                      !bodyParams.fromValue) {
            const detailLine = 'All ACL parameters needed when adding a ACL set';
            return errorMessagePayload(400, detailLine);
          }

          // is parameter allow given, properly, values 0/1
          if (bodyParams.allow) {
            if (isNaN(bodyParams.allow) || 1 * bodyParams.allow < 0 || 1 * bodyParams.allow > 1) {
              return errorMessagePayload(400, 'Parameter "allow", allowed values are 0 and 1.',
              'allow', bodyParams.allow);
            }
            aclFields.allow = 1 * bodyParams.allow;
            delete bodyParams.allow;
          }

          // is parameter access given, properly, values 1/2/3
          if (bodyParams.access) {
            if (isNaN(bodyParams.access) ||
            1 * bodyParams.access < 1 ||
            1 * bodyParams.access > 3) {
              return errorMessagePayload(400, 'Parameter "access" has erroneous value.',
              'access', bodyParams.access);
            }
            aclFields.access = 1 * bodyParams.access;
            delete bodyParams.access;
          }

          // is topic given
          if (bodyParams.topic) {
            aclFields.topic = bodyParams.topic;
            delete bodyParams.topic;
          }

          // is parameter fromType given, properly
          if (bodyParams.fromType) {
            const allowedfromTypeValues = ['clientid', 'username', 'ipaddr'];
            if (!allowedfromTypeValues.includes(bodyParams.fromType)) {
              return errorMessagePayload(400, 'Parameter "fromType" has erroneous value.',
              'fromType', bodyParams.fromType);
            }
            aclFields.fromType = bodyParams.fromType;
            delete bodyParams.fromType;
          }

          // is parameter fromValue given, properly
          if (bodyParams.fromValue) {
            aclFields.fromValue = bodyParams.fromValue;
            delete bodyParams.fromValue;
          }

          // Fill in general values for new ACL object
          if (!aclFields.id) {
            aclFields.id = new Meteor.Collection.ObjectID().valueOf();
          }

          if (!aclFields.proxyId) {
            aclFields.proxyId = proxy._id;
          }

          // add or update modified ACL object
          proxyBackend.emq.settings.acl[ACLIndex] = aclFields;
          delete bodyParams.editIndex;
        }

        // Removal of ACL data
        if (bodyParams.removeIndex) {
          // Prepare index
          const removeIndex = 1 * bodyParams.removeIndex;

          // Does the ACL remove index have correct value
          if (isNaN(removeIndex) || removeIndex < 0 || removeIndex > countOfACL) {
            const detailLine = `Allowed range for 'removeIndex' is 0 - ${countOfACL - 1}`;
            return errorMessagePayload(400, detailLine, 'removeIndex', removeIndex);
          }
          // find the ACL object
          if (!proxyBackend.emq.settings.acl[removeIndex]) {
            const detailLine = 'ACL object does not exist';
            return errorMessagePayload(400, detailLine);
          }

          // Remove the indicated ACL object
          proxyBackend.emq.settings.acl.splice(removeIndex, 1);
          delete bodyParams.removeIndex;
        }

        // Send updated ACL parameters to EMQ proxy
        const emqResponseError = Meteor.call('emqAclRequest',
                                             'PUT',
                                             proxyBackend.proxyId,
                                             proxyBackend.emq.settings.acl);

        if (emqResponseError) {
          return errorMessagePayload(500, 'Settings update to EMQ proxy failed.');
        }
      } else {
        return errorMessagePayload(400, 'Unknown proxy type.');
      }

      // Are there not handled parameters still left
      if (Object.keys(bodyParams).length) {
        return errorMessagePayload(400, 'Erroneous parameters given.', 'params', bodyParams);
      }

      // Update the apiUmbrella Proxy Backend document on APInf
      const result = ProxyBackends.update(proxyBackendId, { $set: proxyBackend });
      if (!result) {
        return errorMessagePayload(500, 'Updating proxyBackend failed.');
      }

      // Get API's just inserted Proxy connection data for response
      const createdProxyBackend = ProxyBackends.findOne({ apiId });
      if (!createdProxyBackend) {
        // The Proxy backend doesn't exist
        return errorMessagePayload(500, 'Proxy connection for the API is not created.');
      }

      // OK response with API data
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: createdProxyBackend,
        },
      };
    },
  },
  // Delete API's proxy connection
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Disconnect an APIs from Proxy.',
      description: descriptionApis.deleteProxyBackend,
      parameters: [
        CatalogV1.swagger.params.apiId,
      ],
      responses: {
        204: {
          description: 'Proxy connection removed from this API',
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
          description: 'Proxy connection was not found',
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
      // Get ID of API (URL parameter)
      const apiId = this.urlParams.id;
      // Get User ID
      const userId = this.userId;

      // API related checkings
      // Get API document
      const api = Apis.findOne(apiId);

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // User must be able to manage API
      if (!api.currentUserCanManage(userId)) {
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Get API's Proxy connection data
      const proxyBackend = ProxyBackends.findOne({ apiId });
      if (!proxyBackend) {
        // The Proxy backend doesn't exist
        return errorMessagePayload(404, 'Proxy connection for the API is not found.');
      }

      // Remove the proxy backend
      // Check if there is proxy backend with certain type
      if (proxyBackend.type === 'emq' || proxyBackend.type === 'apiUmbrella') {
        // Delete proxyBackend
        Meteor.call('deleteProxyBackend', proxyBackend);
      }


      // OK response with HTTP code only
      return {
        statusCode: 204,
        body: {
          status: 'success',
          data: proxyBackend,
        },
      };
    },
  },

});
