/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apis/collection';
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

ApiV1.swagger.meta.paths = {
  '/login': {
    post: {
      tags: [
        ApiV1.swagger.tags.login,
      ],
      summary: 'Logging in.',
      description: 'By giving existing username and password you get login credentials.',
      produces: 'application/json',
      parameters: [
        ApiV1.swagger.params.login,
      ],
      responses: {
        200: {
          description: 'Success',
          schema: {
            $ref: '#/definitions/loginResponse',
          },
        },
        400: {
          description: 'Bad query parameters',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

};

// Request /rest/v1/apis for Apis collection
ApiV1.addCollection(Apis, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Return a list of all public entities within the collection
    getAll: {
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        summary: 'List and search public API.',
        description: 'List and search public APIs.',
        parameters: [
          ApiV1.swagger.params.optionalSearch,
          ApiV1.swagger.params.organizationApi,
          ApiV1.swagger.params.skip,
          ApiV1.swagger.params.limit,
          ApiV1.swagger.params.lifecycle,
        ],
        responses: {
          200: {
            description: 'Returns list of public APIs',
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
            description: 'Bad query parameters',
          },
        },
      },
      action () {
        const queryParams = this.queryParams;

        // Only Public APIs are available for unregistered user
        const query = { isPublic: true };
        const options = {};

        // Parse query parameters
        if (queryParams.organizationApi) {
          // Get organization document with specified ID
          const organization = Organizations.findOne(queryParams.organizationApi);

          // Make sure Organization exists
          if (organization) {
            // Get list of managed API IDs
            query._id = { $in: organization.managedApiIds() };
          }
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
    // Return the entity with the given :id
    get: {
      authRequired: false,
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        summary: 'Fetch API with specified ID.',
        description: 'Returns one API with specified ID or nothing if there is not match found.',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'Returns API',
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
          404: {
            description: 'Bad parameter',
          },
        },
      },
    },
    post: {
      authRequired: true,
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        summary: 'Add new API to catalog.',
        description: 'Adds an API to catalog. On success, returns newly added API object.',
        parameters: [
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API successfully added',
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
            description: 'Invalid input, object invalid',
          },
          401: {
            description: 'Authentication is required',
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
        const mandatoryFieldsFilled = this.bodyParams.name && this.bodyParams.url;

        // Make sure required fields are set
        if (mandatoryFieldsFilled) {
          // Check if API with same name already exists
          if (Apis.findOne({ name: this.bodyParams.name })) {
            return {
              statusCode: 400,
              body: {
                status: 'Fail',
                message: 'Duplicate API name',
              },
            };
          }

          // Add manager IDs list into
          const apiData = Object.assign({ managerIds: [userId] }, this.bodyParams);

          // Insert API data into collection
          const apiId = Apis.insert(apiData);

          // Give user manager role
          Roles.addUsersToRoles(userId, 'manager');

          return {
            statusCode: 200,
            body: {
              status: 'Success',
              data: Apis.findOne(apiId),
            },
          };
        }

        // Otherwise show message about required fields
        return {
          statusCode: 409,
          body: {
            message: 'Fields "name" and "url" are required',
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
          ApiV1.swagger.tags.api,
        ],
        summary: 'Update API.',
        description: 'Update an API.',
        parameters: [
          ApiV1.swagger.params.apiId,
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API successfully edited.',
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
        // const IsAdmin = Roles.userIsInRole(userId, ['admin']);

        const api = Apis.findOne(apiId);

        // Make sure API exists & user can manage
        if (api) {
          if (api.currentUserCanManage(userId)) {
            // Update API document
            Apis.update(apiId, { $set: bodyParams });

            return {
              statusCode: 200,
              body: {
                status: 'Success updating',
                data: Apis.findOne(apiId),
              },
            };
          }

          // API exists but user can not manage
          return {
            statusCode: 403,
            body: {
              status: 'Fail',
              message: 'You do not have permission for editing this API',
            },
          };
        }

        // API doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'API is not found with specified ID',
          },
        };
      },
    },
    delete: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        summary: 'Delete API.',
        description: 'Deletes the identified API from the system.',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'API successfully removed.',
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

        // Make sure API exists & user can manage
        if (api) {
          if (api.currentUserCanManage(userId)) {
            // Remove API document
            Meteor.call('removeApi', api._id);

            return {
              statusCode: 200,
              body: {
                status: 'Api successfully removed',
                data: Apis.findOne(apiId),
              },
            };
          }

          // API exists but user can not manage
          return {
            statusCode: 403,
            body: {
              status: 'Fail',
              message: 'You do not have permission for removing this API',
            },
          };
        }

        // API doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'API is not found with specified ID',
          },
        };
      },
    },
  },
});
