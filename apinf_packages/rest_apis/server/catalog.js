/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

import catalogGeneralDescription from '/apinf_packages/rest_apis/descriptions/catalog_texts';

const CatalogV1 = new Restivus({
  apiPath: 'rest',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration - meta, tags, params, definitions
CatalogV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: catalogGeneralDescription,
      version: '1.0.0',
      title: 'Admin API for API handling',
    },
    // Create  placeholder for storage paths for Users collection
    paths: {},
    securityDefinitions: {
      userSecurityToken: {
        in: 'header',
        name: 'X-Auth-Token',
        type: 'apiKey',
      },
      userId: {
        in: 'header',
        name: 'X-User-Id',
        type: 'apiKey',
      },
    },
  },
  tags: {
    api: 'APIs',
    login: 'Login',
    logout: 'Logout',
  },
  params: {
    api: {
      name: 'api',
      in: 'body',
      description: 'Data for adding or editing API',
      schema: {
        $ref: '#/definitions/api',
      },
    },
    apiId: {
      name: 'id',
      in: 'path',
      description: 'ID of API',
      required: true,
      type: 'string',
    },
    lifecycle: {
      name: 'lifecycle',
      in: 'query',
      description: 'Limit the listing based on lifecycle status of APIs.',
      required: false,
      type: 'string',
      enum: ['design', 'development', 'testing', 'production', 'deprecated'],
    },
    limit: {
      name: 'limit',
      in: 'query',
      description: 'Maximum number of records to return in query.',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 50,
    },
    login: {
      name: 'user',
      in: 'body',
      description: 'User login data',
      schema: {
        $ref: '#/definitions/loginRequest',
      },
    },
    managedAPIs: {
      name: 'managedAPIs',
      in: 'query',
      description: 'Limit results to APIs which requesting user can manage.',
      required: false,
      type: 'string',
      enum: ['true', 'false'],
    },
    optionalSearch: {
      name: 'q',
      in: 'query',
      description: 'An optional search string for looking up inventory.',
      required: false,
      type: 'string',
    },
    organizationApi: {
      name: 'organization',
      in: 'query',
      description: 'An optional organization id will limit results to the given organization.',
      required: false,
      type: 'string',
    },
    skip: {
      name: 'skip',
      in: 'query',
      description: 'Number of records to skip for pagination.',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 0,
    },
  },
  definitions: {
    // The schema defining the type used for the body parameter in POST or PUT method
    api: {
      required: ['name', 'url'],
      properties: {
        name: {
          type: 'string',
          example: 'My REST API',
        },
        description: {
          type: 'string',
          example: 'My REST API description',
        },
        url: {
          type: 'string',
          format: 'url',
          example: 'https://my.rest.api.com/v1',
        },
        lifecycleStatus: {
          type: 'string',
          enum: ['design', 'development', 'testing', 'production', 'deprecated'],
          example: 'design/development/testing/production/deprecated',
        },
        isPublic: {
          type: 'string',
          enum: ['true', 'false'],
          example: 'true/false',
        },
      },

    },
    apiResponse: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: 'api-id-value',
        },
        name: {
          type: 'string',
          example: 'My REST API',
        },
        latestMonitoringStatusCode: {
          type: 'string',
          example: '-1',
        },
        description: {
          type: 'string',
          example: 'My REST API description',
        },
        url: {
          type: 'string',
          example: 'http://my.rest.api.com/v1',
        },
        managerIds: {
          type: 'array',
          items: {
            type: 'string',
            example: 'manager-id',
          },
        },
        slug: {
          type: 'string',
          example: 'organization-slug',
        },
        lifecycleStatus: {
          type: 'string',
          example: 'design/development/testing/production/deprecated',
        },
        authorizedUserIds: {
          type: 'array',
          items: {
            type: 'string',
            example: 'user-id',
          },
        },
        createdAt: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        bookmarkCount: {
          type: 'string',
          example: '0',
        },
        isPublic: {
          type: 'boolean',
          example: 'true',
        },
        friendlySlugs: {
          type: 'object',
          properties: {
            slug: {
              type: 'object',
              properties: {
                base: {
                  type: 'string',
                  example: 'my-rest-api',
                },
                index: {
                  type: 'string',
                  example: '0',
                },
              },
            },
          },
        },
      },
    },
    loginRequest: {
      required: ['username', 'password'],
      properties: {
        username: {
          type: 'string',
          description: 'Username',
          example: 'johndoe',
        },
        password: {
          type: 'string',
          description: 'Password for user',
          example: 'mypassword',
        },
      },
    },
    loginResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            authToken: {
              type: 'string',
              example: 'auth-token-value',
            },
            userId: {
              type: 'string',
              example: 'user-id-value',
            },
          },
        },
      },
    },

  },
};

// Generate Swagger to route /rest/v1/api_catalog.json
CatalogV1.addSwagger('catalog.json');

export default CatalogV1;
