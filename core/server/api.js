/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
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
ApiV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: 'APinf is open source API management and catalog. ',
      version: '1.0.0',
      title: 'Admin API',
    },
    paths: {
      '/users': {
        get: {},
        post: {},
      },

      '/users/{id}': {
        get: {},
        delete: {},
        put: {},
      },

      '/users/updates': {
        get: {},
      },

      '/login': {
        post: {},
      },

    },
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
    organization: 'Organizations',
    users: 'Users',
    login: 'Login',
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
    company: {
      name: 'company',
      in: 'body',
      description: 'Company name of user',
      required: true,
      type: 'string',
    },
    createdAt: {
      name: 'createdAt',
      in: 'body',
      description: 'Date and time in ISODate format, e.g. "2012-07-14T01:00:00+01:00" ',
      type: 'string',
    },
    email: {
      name: 'email',
      in: 'body',
      description: 'Email address for user',
      required: true,
      type: 'string',
    },
    emailResponse: {
      properties: {
        name: 'address',
        in: 'body',
        description: 'Email address for user',
        type: 'string',
      },
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
    optionalSearch: {
      name: 'q',
      in: 'query',
      description: 'An optional search string for looking up inventory.',
      required: false,
      type: 'string',
    },
    organization: {
      name: 'organization',
      in: 'body',
      description: 'Data for adding or editing Organization',
      schema: {
        $ref: '#/definitions/organization',
      },
    },
    organizationApi: {
      name: 'organization',
      in: 'query',
      description: 'An optional organization id will limit results to the given organization.',
      required: false,
      type: 'string',
    },
    organizationId: {
      name: 'id',
      in: 'path',
      description: 'ID of Organization',
      required: true,
      type: 'string',
    },
    password: {
      name: 'password',
      in: 'body',
      description: 'Password for user',
      required: true,
      type: 'string',
    },
    since: {
      name: 'since',
      in: 'query',
      description: 'Time frame in days',
      required: false,
      type: 'integer',
      format: 'int32',
      minimum: 1,
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
    sortBy: {
      name: 'sort_by',
      in: 'query',
      description: 'Criteria for sort ',
      required: false,
      type: 'string',
    },
    userAddition: {
      name: 'user',
      in: 'body',
      description: 'Data for adding a new User',
      schema: {
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'Username',
            example: 'johndoe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'E-mail address of user',
            example: 'john.doe@ispname.com',
          },
          password: {
            type: 'string',
            description: 'Password for user',
            example: 'mypassword',
          },
        },

        // $ref: '#/definitions/user_addition',
      },
    },
    userLogin: {
      name: 'user',
      in: 'body',
      description: 'User login data',
      schema: {
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
    },

    userUpdate: {
      name: 'user',
      in: 'body',
      description: 'Data for updating a User',
      schema: {
        required: ['username', 'company', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'Username',
            example: 'johndoe',
          },
          company: {
            type: 'string',
            description: 'Name of company user belongs to',
            example: 'Mighty API owners Ltd.',
          },
          password: {
            type: 'string',
            description: 'Password for user',
            example: 'mypassword',
          },
        },
        // $ref: '#/definitions/user_update',
      },
    },

    userId: {
      name: 'id',
      in: 'path',
      description: 'ID of User',
      required: true,
      type: 'string',
    },
    userIdResponse: {
      name: '_id',
      in: 'body',
      description: 'ID of User',
      required: true,
      type: 'string',
    },
    username: {
      name: 'username',
      in: 'body',
      description: 'Username',
      required: true,
      type: 'string',
      example: 'johndoe',
    },
    userOrganizationId: {
      name: 'organization_id',
      in: 'query',
      description: 'ID of Organization, that User belongs to',
      required: false,
      type: 'string',
    },
    user_login_response: {
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
              example: '7L4jNt-dfNFGH3igPslP5VMH0-hrnbMSFtmjfVOMm_zVg0yT8eGQ-',
            },
            userId: {
              type: 'string',
              example: 'GFJzMtdzqEYgH8PHSQ-',
            },
          },
        },
      },
    },
    get_user_data: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '7L4jNtdfNFGH3igPs',
            },
            created_at: {
              $ref: '#/definitions/get_user_created_at',
            },
            username: {
              type: 'string',
              example: 'myusername',
            },
            emails: {
              $ref: '#/definitions/post_user_email_address',
            },
            profile: {
              $ref: '#/definitions/get_user_profile',
            },
            roles: {
              $ref: '#/definitions/get_user_roles',
            },
            organization: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization_id: {
                    type: 'string',
                    example: 'eFsLsJH3JTos4HfLc',
                  },
                  organization_name: {
                    type: 'string',
                    example: 'APInf oy',
                  },
                },
              },


              // $ref: '#/definitions/get_user_organization',
            },
          },
        },
      },
    },
    post_user_response: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '7L4jNtdfNFGH3igPs',
            },
            created_at: {
              $ref: '#/definitions/get_user_created_at',
            },
            username: {
              type: 'string',
              example: 'myusername',
            },
            emails: {
              $ref: '#/definitions/post_user_email_address',
            },
            profile: {
              $ref: '#/definitions/get_user_profile',
            },
          },
        },
      },
    },

  },
  definitions: {
    // The schema defining the type used for the body parameter.
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
        },
      },
    },
    organization: {
      required: ['name', 'url'],
      properties: {
        name: {
          type: 'string',
          example: 'Company',
        },
        description: {
          type: 'string',
          example: 'Description about company',
        },
        url: {
          type: 'string',
          format: 'url',
          example: 'https://organization.com',
        },
        contact_name: {
          type: 'string',
          description: 'Name of company manager',
          example: 'David Bar',
        },
        contact_phone: {
          type: 'string',
          description: 'Phone number of company manager',
          example: '+7 000 000 00 00',
        },
        contact_email: {
          type: 'string',
          format: 'email',
          description: 'E-mail address of company manager',
          example: 'company-mail@gmail.com',
        },
        facebook: {
          type: 'string',
          format: 'url',
          description: 'Link to Facebook',
          example: 'http://url.com',
        },
        twitter: {
          type: 'string',
          format: 'url',
          description: 'Link to Twitter',
          example: 'http://url.com',
        },
        instagram: {
          type: 'string',
          format: 'url',
          description: 'Link to Instagram',
          example: 'http://url.com',
        },
        linkedin: {
          type: 'string',
          format: 'url',
          description: 'Link to Linked In',
          example: 'http://url.com',
        },
      },
    },

    users: {
      required: ['username', 'email', 'password'],
      properties: {
        username: {
          type: 'string',
          description: 'Username',
          example: 'johndoe',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'E-mail address of user',
          example: 'john.doe@ispname.com',
        },
        password: {
          type: 'string',
          description: 'Password for user',
          example: 'mypassword',
        },
        company: {
          type: 'string',
          description: 'Company name of user',
          example: 'My Company Ltd',
        },
      },
    },

    get_user_profile: {
      type: 'object',
      properties: {
        company: {
          type: 'string',
          example: 'Mighty API owners Ltd.',
        },
      },
    },
    get_user_created_at: {
      type: 'string',
      example: '2012-07-14T01:00:00+01:00',
      description: 'Dates and times are stored in ISODate format',

    },
    post_user_email_address: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            example: 'sam.won@apinf.io',
          },
          verified: {
            type: 'string',
            example: 'false',
          },
        },
      },
    },
    get_user_roles: {
      type: 'array',
      items: {
        type: 'string',
        example: 'manager',
      },
    },

  },
};

// Generate Swagger to route /rest/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
