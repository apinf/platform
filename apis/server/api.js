/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apis/collection';
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

// Request /apinf-rest/v1/apis for Apis collection
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
        description: 'List and search APIs.',
        parameters: [
          ApiV1.swagger.params.optionalSearch,
          ApiV1.swagger.params.organization,
          ApiV1.swagger.params.skip,
          ApiV1.swagger.params.limit,
          ApiV1.swagger.params.lifecycle,
        ],
        responses: {
          200: {
            description: 'Returns list of APIs',
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
        if (queryParams.organization) {
          // Get organization document with specified ID
          const organization = Organizations.findOne(queryParams.organization);

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
        description: 'Returns result is one or zero (no match found) APIs',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'Returns API entity',
          },
          404: {
            description: 'Bad parameters',
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
        description: 'Adds an API to catalog. On success methods return added object with details.',
        parameters: [
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API was successful added',
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
    },
    // Partially modify the entity with the given :id with the data contained in the request body.
    // Only fields included will be modified.
    put: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'This is a post route to post things. Updates API to the system.',
        parameters: [
          ApiV1.swagger.params.apiId,
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API was successful edited.',
          },
          401: {
            description: 'Authentication is required',
          },
          404: {
            description: 'API is not found with specified ID',
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
        const api = Apis.findOne(apiId);

        // Make sure API exists
        if (api) {
          // Update API document
          Apis.update(apiId, { $set: bodyParams });

          return {
            statusCode: 200,
            body: {
              status: 'Success updating 12345',
              data: Apis.findOne(apiId),
            },
          };
        }

        return {
          statusCode: 404,
          body: {
            status: 'fail',
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
        description: 'Deletes the identified API from the system.',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'API was successful removed.',
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
    },
  },
});
