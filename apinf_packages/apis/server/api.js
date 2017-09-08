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

CatalogV1.swagger.meta.paths = {
  '/login': {
    post: {
      tags: [
        CatalogV1.swagger.tags.login,
      ],
      summary: 'Logging in.',
      description: `
   ### Logging in ###
   
   By giving existing username and password you get login credentials,
   which you can use in authenticating requests.

   login response parameter value | to be filled into request header field
   :--- | :---
   auth-token-value | X-Auth-Token
   user-id-value | X-User-Id


      `,
      produces: ['application/json'],
      parameters: [
        CatalogV1.swagger.params.login,
      ],
      responses: {
        200: {
          description: 'Success',
          schema: {
            $ref: '#/definitions/loginResponse',
          },
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

};

// Request /rest/v1/apis for Apis collection
CatalogV1.addCollection(Apis, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Return a list of all public entities within the collection
    getAll: {
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'List and search public API.',
        description: `
   ### List and search public APIs ###

   Parameters are optional and also combinations of parameters can be used.

   Example call:

       GET /apis?limit=200&managedAPIs=true

   Result: returns maximum of 200 APIs which are managed by requesting user.


   Note! When using parameter managedAPIs, the Manager's user ID is needed
   in X-User-Id field in message header.
        `,

        parameters: [
          CatalogV1.swagger.params.optionalSearch,
          CatalogV1.swagger.params.organizationApi,
          CatalogV1.swagger.params.skip,
          CatalogV1.swagger.params.limit,
          CatalogV1.swagger.params.lifecycle,
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
            description: 'Bad Request',
          },
        },
      },
      action () {
        const queryParams = this.queryParams;
        // Only Public APIs are available for unregistered user
        const query = { isPublic: true };
        const options = {};

        // Get APIs managed by user requesting operation
        if (queryParams.managedAPIs) {
          // Get Manager ID from header
          const managerId = this.request.headers['x-user-id'];

          // Response with error in case managerId is missing
          if (!managerId) {
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Bad query parameters. Manager ID expected in header (X-User-Id).',
              },
            };
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
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Bad query parameters. Organization not found.',
              },
            };
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
    // Return the entity with the given :id
    get: {
      authRequired: false,
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Fetch API with specified ID.',
        description: `
   Returns the API with specified ID, if a match is found.

   Example call:

        GET /apis/:id

   Result: returns the data of API identified with :id.

        `,
        parameters: [
          CatalogV1.swagger.params.apiId,
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
            description: 'Not Found',
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
        description: `
   Adds an API to catalog. On success, returns the added API object.


   Parameters
   * mandatory: name and url
   * length of description must not exceed 1000 characters
   * value of lifecycleStatus must be one of example list
   * if isPublic is false, only admin or manager can see the API
        `,
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
            description: 'Bad Request',
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
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "name" is mandatory',
            },
          };
        }

        // Validate name
        let isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'name');

        if (!isValid) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "name" is erroneous',
            },
          };
        }

        // URL is a mandatory field
        if (!this.bodyParams.url) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "url" is mandatory',
            },
          };
        }

        // Validate URL
        isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'url');

        if (!isValid) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "URL" is erroneous',
            },
          };
        }

        // Check if API with same name already exists
        if (Apis.findOne({ name: this.bodyParams.name })) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Duplicate: API with same name already exists',
            },
          };
        }


        // Description must not exceed field length in DB
        if (this.bodyParams.description) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Description length must not exceed 1000 characters',
              },
            };
          }
        }

        // Is value of lifecycle status allowed
        if (this.bodyParams.lifecycleStatus) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Parameter lifecycleStatus has erroneous value',
              },
            };
          }
        }

        // Add manager IDs list into
        const apiData = Object.assign({ managerIds: [userId] }, this.bodyParams);

        // Insert API data into collection
        const apiId = Apis.insert(apiData);

        // Did insert fail
        if (!apiId) {
          return {
            statusCode: 500,
            body: {
              status: 'fail',
              message: 'Inserting API into database failed',
            },
          };
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
        description: `
   Updates an API in catalog. On success, returns the updated API object.

   Parameters
   * length of description must not exceed 1000 characters
   * value of lifecycleStatus must be one of example list
        `,
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
            description: 'Bad Request',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'No permission',
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
          return {
            statusCode: 404,
            body: {
              status: 'fail',
              message: 'API with specified ID is not found',
            },
          };
        }

        // API exists but user can not manage
        if (!api.currentUserCanManage(userId)) {
          return {
            statusCode: 403,
            body: {
              status: 'fail',
              message: 'You do not have permission for editing this API',
            },
          };
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
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Description length must not exceed 1000 characters',
              },
            };
          }
        }

        // Is value of lifecycle status allowed
        if (this.bodyParams.lifecycleStatus) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return {
              statusCode: 400,
              body: {
                status: 'fail',
                message: 'Parameter lifecycleStatus has erroneous value',
              },
            };
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
        description: `
   Deletes the identified API from the Catalog, if a match is found.


   Example call:

        DELETE /apis/:id

   Result: deletes the API identified with :id and responds with HTTP code 204.

        `,
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
            description: 'No permission',
          },
          404: {
            description: 'API not found',
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
          return {
            statusCode: 404,
            body: {
              status: 'fail',
              message: 'API with specified ID is not found',
            },
          };
        }

        // User must be able to manage API
        if (!api.currentUserCanManage(userId)) {
          return {
            statusCode: 403,
            body: {
              status: 'fail',
              message: 'User does not have permission to remove this API',
            },
          };
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
