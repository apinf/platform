/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

// APInf imports
import proxyGeneralDescription from '/apinf_packages/rest_apis/lib/descriptions/proxies_texts';

const ProxyV1 = new Restivus({
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
ProxyV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: proxyGeneralDescription.generalDescription,
      version: '1.0.0',
      title: 'Admin API for Proxy handling',
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
    authentication: 'Authentication',
    proxy: 'Proxies',
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
    organizationApi: {
      name: 'organization',
      in: 'query',
      description: 'An optional organization id will limit results to the given organization.',
      required: false,
      type: 'string',
    },
    url: {
      name: 'url',
      in: 'query',
      description: 'Documentation link to be removed.',
      required: false,
      type: 'string',
    },

    // Proxy related parameters
    proxyId: {
      name: 'id',
      in: 'path',
      description: 'ID of Proxy',
      required: true,
      type: 'string',
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
        documentationUrl: {
          type: 'string',
          description: 'URI to OpenAPI (Swagger) specification of the API',
          example: 'http://link-address-to-specification.com',
        },
        externalDocumentation: {
          type: 'string',
          description: 'A URL to an external site page with API documentation',
          example: 'http://url-to-external-site.com',
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
        created_at: {
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
        updated_at: {
          type: 'string',
          example: '2017-07-14T01:00:00+01:00',
        },
        apiLogoFileId: {
          type: 'string',
          example: 'file-id',
        },
        logoURL: {
          type: 'string',
          example: 'link-address-to-logo-image',
        },
        documentationUrl: {
          type: 'string',
          description: 'URI to OpenAPI (Swagger) specification of the API',
          example: 'link-address-to-specification',
        },
        externalDocumentation: {
          type: 'array',
          description: 'A URL to an external site page with API documentation',
          items: {
            type: 'string',
            example: 'url-to-external-site',
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

    // proxy related definitions
    proxyResponse: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: 'proxy-id-value',
        },
        name: {
          type: 'string',
          example: 'API Umbrella',
        },
        description: {
          type: 'string',
          example: 'Description of proxy in question',
        },
        type: {
          type: 'string',
          example: 'apiUmbrella',
        },
        apiUmbrella: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              example: 'https://proxy.url.and:port',
            },
            apiKey: {
              type: 'string',
              example: 'proxy-id-value',
            },
            authToken: {
              type: 'string',
              example: 'token-value',
            },
            elasticsearch: {
              type: 'string',
              example: 'https://search.address.and:port',
            },
          },
        },
      },
    },
  },
};

// Generate Swagger to route /rest/v1/api_catalog.json
ProxyV1.addSwagger('proxy.json');

export default ProxyV1;
