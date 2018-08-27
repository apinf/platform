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
    fromRawDate: {
      name: 'fromDate',
      in: 'query',
      description: analyticsDescription.fromRawDate,
      required: true,
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
    skip: {
      name: 'skip',
      in: 'query',
      description: 'Number of records to skip for pagination.',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 0,
    },
    startDate: {
      name: 'startDate',
      in: 'query',
      description: analyticsDescription.startDate,
      required: false,
      type: 'string',
    },
    toRawDate: {
      name: 'toDate',
      in: 'query',
      description: analyticsDescription.toRawDate,
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
  },
  definitions: {
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
        medianResponseTime: {
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
    deltaValues: {
      properties: {
        requestDelta: {
          type: 'integer',
          format: 'int32',
          example: 150,
        },
        medianResponseDelta: {
          type: 'integer',
          format: 'int32',
          example: -50,
        },
        uniqueUsersDelta: {
          type: 'integer',
          format: 'int32',
          example: 120,
        },
      },
    },
    dailyDetails: {
      type: 'object',
      properties: {
        trafficDate: {
          type: 'string',
          format: 'date',
          example: '2017-07-21',
          description: 'Date yyyy-mm-dd as in ISO 8601',
        },
        intervals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              intervalStart: {
                type: 'string',
                example: '00:00',
                description: 'Time hh:mm as in ISO 8601',
              },
              requestCount: {
                type: 'integer',
                format: 'int32',
                example: 333,
              },
              uniqueUsers: {
                type: 'integer',
                format: 'int32',
                example: 17,
              },
              responses: {
                type: 'object',
                properties: {
                  status200: {
                    type: 'integer',
                    format: 'int32',
                    example: 299,
                  },
                  status300: {
                    type: 'integer',
                    format: 'int32',
                    example: 5,
                  },
                  status400: {
                    type: 'integer',
                    format: 'int32',
                    example: 28,
                  },
                  status500: {
                    type: 'integer',
                    format: 'int32',
                    example: 1,
                  },
                },
              },
              responseTime: {
                type: 'object',
                properties: {
                  shortest: {
                    type: 'integer',
                    format: 'int32',
                    example: 22,
                  },
                  median: {
                    type: 'integer',
                    format: 'int32',
                    example: 54,
                  },
                  percentile95: {
                    type: 'integer',
                    format: 'int32',
                    example: 78,
                  },
                  longest: {
                    type: 'integer',
                    format: 'int32',
                    example: 80,
                  },
                },
              },
            },
          },
        },
      },
    },
    details: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          endpoint: {
            type: 'string',
            example: '/catalog2/{id}',
          },
          days: {
            type: 'array',
            items: {
              $ref: '#/definitions/dailyDetails',
            },
          },
        },
      },
    },
    errorStatistics: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'string',
          format: 'date',
          example: '2017-07-21T13:59:59,99',
        },
        httpCode: {
          type: 'integer',
          example: 403,
        },
        calls: {
          type: 'integer',
          example: 3,
        },
        requestPath: {
          type: 'string',
          example: 'catalog2/users',
        },
      },
    },
    flowData: {
      type: 'object',
      properties: {
        meta: {
          $ref: '#/definitions/meta',
        },
        kpi: {
          $ref: '#/definitions/countersKPI',
        },
        delta: {
          $ref: '#/definitions/deltaValues',
        },
        frequentUsers: {
          type: 'array',
          items: {
            $ref: '#/definitions/frequentUser',
          },
        },
        errorStatistics: {
          type: 'array',
          items: {
            $ref: '#/definitions/errorStatistics',
          },
        },
        details: {
          $ref: '#/definitions/details',
        },
      },
    },
    frequentUser: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          example: '<user-email-address>',
        },
        calls: {
          type: 'integer',
          example: 15,
        },
        requestPath: {
          type: 'string',
          example: 'catalog2/users',
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
    rawDataResponse: {
      type: 'object',
      properties: {
        set: {
          type: 'object',
          properties: {
            size: {
              type: 'integer',
              example: '100',
            },
            from: {
              type: 'integer',
              example: '200',
            },
            returned: {
              type: 'integer',
              example: '100',
            },
            left: {
              type: 'integer',
              example: '47',
            },
            found: {
              type: 'integer',
              example: '347',
            },
          },
        },
        data: {
          type: 'object',
          properties: {
            request_path: {
              type: 'string',
              example: 'https://apis-url-here/endpoint-name',
            },
            request_method: {
              type: 'string',
              example: 'GET | POST | PUT | DELETE',
            },
            response_status: {
              type: 'integer',
              example: '200',
            },
            response_size: {
              type: 'integer',
              example: '1324',
            },
            request_at: {
              type: 'integer',
              example: '1489580360900',
            },
          },
        },
      },
    }

    // The schema defining the type used for the body parameter in POST or PUT method

  },
};

// Generate Swagger to route /rest/v1/api_catalog.json
AnalyticsV1.addSwagger('analytics.json');

export default AnalyticsV1;
