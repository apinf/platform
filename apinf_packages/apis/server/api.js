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
import CatalogV1 from '/apinf_packages/rest_apis/server/catalog';
import Organizations from '/apinf_packages/organizations/collection';

// APInf imports
import descriptionApis from '/apinf_packages/rest_apis/lib/descriptions/apis_texts';
import descriptionLoginLogout from '/apinf_packages/rest_apis/lib/descriptions/login_logout_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/rest_api_helpers';

CatalogV1.swagger.meta.paths = {
  '/login': {
    post: {
      tags: [
        CatalogV1.swagger.tags.login,
      ],
      summary: 'Logging in.',

      description: descriptionLoginLogout.login,
      produces: ['application/json'],
      parameters: [
        CatalogV1.swagger.params.login,
      ],
      responses: {
        200: {
          description: 'Logged in successfully',
          schema: {
            $ref: '#/definitions/loginResponse',
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
        },
        401: {
          description: 'Authentication is required',
        },
      },
    },
  },

  '/logout': {
    post: {
      tags: [
        CatalogV1.swagger.tags.logout,
      ],
      summary: 'Logging out.',

      description: descriptionLoginLogout.logout,
      produces: ['application/json'],
      responses: {
        200: {
          description: 'You\'ve been logged out!',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              message: {
                type: 'string',
                example: 'You\'ve been logged out!',
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Missing or erroneous parameter.',
        },
        401: {
          description: 'Unauthorized',
        },
      },
      security: [
        {
          userSecurityToken: [],
          userId: [],
        },
      ],
    },
  },

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
          query.lifecycleStatus = queryParams.lifecycle;
        }

        if (queryParams.limit) {
          options.limit = parseInt(queryParams.limit, 10);
        }

        if (queryParams.skip) {
          options.skip = parseInt(queryParams.skip, 10);
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

        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: Apis.find(query, options).fetch(),
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
          404: {
            description: 'API is not Found',
          },
        },
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

        // structure for validating values against schema
        const validateFields = {
          name: this.bodyParams.name,
          url: this.bodyParams.url,
          description: this.bodyParams.description,
          lifecycleStatus: this.bodyParams.lifecycleStatus,
        };

        // Name is a required field
        if (!this.bodyParams.name) {
          return errorMessagePayload(400, 'Parameter "name" is mandatory.');
        }

        // Validate name
        let isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'name');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "name" is erroneous.');
        }

        // URL is a mandatory field
        if (!this.bodyParams.url) {
          return errorMessagePayload(400, 'Parameter "url" is mandatory.');
        }

        // Validate URL
        isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'url');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "url" is erroneous.');
        }

        // Check if API with same name already exists
        if (Apis.findOne({ name: this.bodyParams.name })) {
          return errorMessagePayload(400, 'Duplicate: API with same name already exists.');
        }


        // Description must not exceed field length in DB
        if (this.bodyParams.description) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }

        // Is value of lifecycle status allowed
        if (this.bodyParams.lifecycleStatus) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        if (this.bodyParams.isPublic) {
          if (this.bodyParams.isPublic === 'true') {
            this.bodyParams.isPublic = true;
          } else if (this.bodyParams.isPublic === 'false') {
            this.bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }

        // Add manager IDs list into
        const apiData = Object.assign({ managerIds: [userId] }, this.bodyParams);

        // Insert API data into collection
        const apiId = Apis.insert(apiData);

        // Did insert fail
        if (!apiId) {
          return errorMessagePayload(500, 'Inserting API into database failed.');
        }

        // Give user manager role
        Roles.addUsersToRoles(userId, 'manager');

        return {
          statusCode: 201,
          body: {
            status: 'success',
            data: Apis.findOne(apiId),
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
        const userId = this.userId;
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
          description: this.bodyParams.description,
          lifecycleStatus: this.bodyParams.lifecycleStatus,
        };

        // Description must not exceed field length in DB
        if (this.bodyParams.description) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }

        // Is value of lifecycle status allowed
        if (this.bodyParams.lifecycleStatus) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        if (this.bodyParams.isPublic) {
          if (this.bodyParams.isPublic === 'true') {
            this.bodyParams.isPublic = true;
          } else if (this.bodyParams.isPublic === 'false') {
            this.bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }

        // Update API document
        Apis.update(apiId, { $set: bodyParams });

        // OK response with API data
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: Apis.findOne(apiId),
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
