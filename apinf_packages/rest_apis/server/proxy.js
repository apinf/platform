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
    // Proxy related parameters
    proxyId: {
      name: 'id',
      in: 'path',
      description: 'ID of Proxy',
      required: true,
      type: 'string',
    },
    proxyRequest: {
      name: 'proxy',
      in: 'body',
      description: 'Data for adding or editing a Proxy',
      schema: {
        $ref: '#/definitions/proxyRequest',
      },
    },
  },
  definitions: {
    // proxy related definitions
    proxyRequest: {
      required: ['name', 'description', 'type'],
      properties: {
        name: {
          type: 'string',
          example: 'Name of proxy',
        },
        description: {
          type: 'string',
          example: 'Description of proxy functionality',
        },
        type: {
          type: 'string',
          enum: ['apiUmbrella', 'emq'],
          example: 'apiUmbrella | emq',
        },
        umbProxyUrl: {
          type: 'string',
          description: 'A URL to proxy',
          format: 'url',
          example: 'https://my.proxy.com:port',
        },
        umbApiKey: {
          type: 'string',
          description: 'API key for API Umbrella',
          example: 'api-key-string',
        },
        umbAuthToken: {
          type: 'string',
          description: 'Authentication Token for API Umbrella',
          example: 'http://link-address-to-specification.com',
        },
        esUrl: {
          type: 'string',
          description: 'A URL to ElasticSearch',
          format: 'url',
          example: 'http://url-to-elastic-search.com:port',
        },
        emqProtocol: {
          type: 'string',
          enum: ['MQTT', 'MQTT over websockets'],
          description: 'Protocol is either MQTT or MQTT over websockets',
          example: 'MQTT | MQTT over websockets',
        },
        emqHost: {
          type: 'string',
          format: 'url',
          example: 'https://emq.host.com',
        },
        emqPort: {
          type: 'integer',
          format: 'int32',
          example: '666',
        },
        emqTLS: {
          type: 'string',
          enum: ['true', 'false'],
          example: 'true | false',
        },
        emqHttpApi: {
          type: 'string',
          format: 'url',
          example: 'https://emq.httpapi.com',
        },
      },
    },
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
        emq: {
          type: 'object',
          properties: {
            brokerEndpoints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  protocol: {
                    type: 'string',
                    format: 'url',
                    example: 'MQTT',
                  },
                  host: {
                    type: 'string',
                    example: 'https://proxy.url',
                  },
                  port: {
                    type: 'integer',
                    format: 'int32',
                    example: '14002',
                  },
                  tls: {
                    type: 'string',
                    example: 'true',
                  },
                },
              },
            },
            httpApi: {
              type: 'string',
              format: 'url',
              example: 'https://emq.httpapi.com',
            },
            elasticsearch: {
              type: 'string',
              description: 'A URL to ElasticSearch',
              format: 'url',
              example: 'http://url-to-elastic-search.com:port',
            },
          },
        },
      },
    },
    proxyBackendResponse: {
      type: 'array',
      items: {
        type: 'string',
        example: 'backend-id',
      },
    },
  },
};

// Generate Swagger to route /rest/v1/proxy.json
ProxyV1.addSwagger('proxy.json');

export default ProxyV1;
