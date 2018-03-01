/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

// APInf imports
import analyticsDescription from '/apinf_packages/rest_apis/lib/descriptions/analytics_texts';

const AnalyticsV1 = new Restivus({
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
AnalyticsV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: analyticsDescription.general,
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
    analytics: 'Analytics',
    authentication: 'Authentication',
  },
  params: {
    apiId: {
      name: 'id',
      in: 'path',
      description: 'ID of API',
      required: true,
      type: 'string',
    },
    apisBy: {
      name: 'apisBy',
      in: 'query',
      description: analyticsDescription.apisBy,
      required: false,
      type: 'string',
      default: 'organization',
      enum: ['organization', 'owner'],
    },
    date: {
      name: 'date',
      in: 'query',
      description: analyticsDescription.date,
      required: false,
      type: 'string',
    },
    interval: {
      name: 'interval',
      in: 'query',
      description: analyticsDescription.interval,
      required: false,
      type: 'string',
      enum: ['30', '60'],
    },
    optionalSearch: {
      name: 'q',
      in: 'query',
      description: 'An optional search string for looking up inventory.',
      required: false,
      type: 'string',
    },
    organizationId: {
      name: 'organizationId',
      in: 'query',
      description: analyticsDescription.organizationId,
      required: false,
      type: 'string',
    },
    period: {
      name: 'period',
      in: 'query',
      description: analyticsDescription.period,
      required: false,
      type: 'integer',
      minimum: 0,
      maximum: 30,
      default: '0',
    },
    periodApiId: {
      name: 'period',
      in: 'query',
      description: analyticsDescription.periodApiId,
      required: false,
      type: 'integer',
      minimum: 0,
      maximum: 30,
      default: '0',
    },
    startDate: {
      name: 'startDate',
      in: 'query',
      description: analyticsDescription.startDate,
      required: false,
      type: 'string',
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

    url: {
      name: 'url',
      in: 'query',
      description: 'Documentation link to be removed.',
      required: false,
      type: 'string',
    },
  },
  definitions: {
    organizationResponse: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: 'organization-id-value',
        },
        name: {
          type: 'string',
          example: 'my Organization',
        },
      },
    },
    apiListFlowData: {
      type: 'object',
      properties: {
        meta: {
          $ref: '#/definitions/meta',
        },
        summaries: {
          $ref: '#/definitions/countersKPI',
        },
      },
    },
    countersKPI: {
      properties: {
        requestCount: {
          type: 'integer',
          format: 'int32',
          example: 666,
        },
        responseTime: {
          type: 'integer',
          format: 'int32',
          example: 78,
        },
        uniqueUsers: {
          type: 'integer',
          format: 'int32',
          example: 5,
        },
      },
    },
    meta: {
      type: 'object',
      properties: {
        proxyPath: {
          type: 'string',
          example: 'http://apinf.io:3002/catalog_api',
        },
        apiName: {
          type: 'string',
          example: 'My API',
        },
        apiId: {
          type: 'string',
          example: 'api-id-string',
        },
        interval: {
          type: 'string',
          example: 1440,
        },
      },
    },


    // The schema defining the type used for the body parameter in POST or PUT method
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
AnalyticsV1.addSwagger('analytics.json');

export default AnalyticsV1;
