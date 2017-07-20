/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const MaintenanceV1 = new Restivus({
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
MaintenanceV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: 'APinf is open source API management and catalog. ',
      version: '1.0.0',
      title: 'Admin API for Maintaining Users and Organizations',
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
    organization: 'Organizations',
    users: 'Users',
    login: 'Login',
  },
  params: {
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
    organizationId: {
      name: 'id',
      in: 'path',
      description: 'ID of Organization',
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
    userDataAdd: {
      name: 'user',
      in: 'body',
      description: 'Data for adding a new User',
      schema: {
        $ref: '#/definitions/usersAdd',
      },
    },
    userDataUpdate: {
      name: 'user',
      in: 'body',
      description: 'Data for updating User',
      schema: {
        $ref: '#/definitions/usersUpdate',
      },
    },
    userId: {
      name: 'id',
      in: 'path',
      description: 'ID of User',
      required: true,
      type: 'string',
    },
    userOrganizationId: {
      name: 'organization_id',
      in: 'query',
      description: 'ID of Organization, that User belongs to',
      required: false,
      type: 'string',
    },
  },
  definitions: {
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

    // Scheme for response parameters
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
        url: {
          type: 'string',
          example: 'https://my.organization.com',
        },
        managerIds: {
          type: 'array',
          items: {
            type: 'string',
            example: 'manager-id',
          },
        },
        createdBy: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        slug: {
          type: 'string',
          example: 'organization-slug',
        },
        createdAt: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        featuredApiIds: {
          type: 'array',
          items: {
            type: 'string',
            example: 'id-of-featured-api',
          },
        },
        friendlySlugs: {
          type: 'object',
          properties: {
            slug: {
              type: 'object',
              properties: {
                base: {
                  type: 'string',
                  example: 'my-organization',
                },
                index: {
                  type: 'string',
                  example: '0',
                },
              },
            },
          },
        },
        updatedAt: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        socialMedia: {
          type: 'object',
          properties: {
            facebook: {
              type: 'string',
              example: 'facebook-url',
            },
            twitter: {
              type: 'string',
              example: 'twitter-url',
            },
            instagram: {
              type: 'string',
              example: 'instagram-url',
            },
            linkedIn: {
              type: 'string',
              example: 'linkedIn-url',
            },
          },
        },
        contact: {
          type: 'object',
          properties: {
            person: {
              type: 'string',
              example: 'contact-person-name',
            },
            phone: {
              type: 'string',
              example: 'contact-person-phone',
            },
            email: {
              type: 'string',
              example: 'contact-person-email',
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
    usersAdd: {
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
    },
    usersUpdate: {
      required: [],
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
        company: {
          type: 'string',
          description: 'Company name of user',
          example: 'My Company Ltd',
        },
      },
    },

    // Simple data for complex structure
    emailAddress: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          example: 'john.doe@ispname.com',
        },
        verified: {
          type: 'boolean',
          example: 'false',
        },
      },
    },

    // Good: Structure for response
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
    // Scheme for describing single object of Users collection
    userItem: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: 'user-id-value',
        },
        created_at: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        username: {
          type: 'string',
          example: 'myusername',
        },
        emails: {
          type: 'array',
          items: {
            $ref: '#/definitions/emailAddress',
          },
        },
        profile: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              example: 'My Company Ltd',
            },
          },
        },
        roles: {
          type: 'array',
          items: {
            type: 'string',
            example: 'manager',
          },
        },
        organization: {
          type: 'array',
          items: {
            type: 'object',
            // TODO: Return the full information about related Organizations
            properties: {
              organization_id: {
                type: 'string',
                example: 'organization-id-value',
              },
              organization_name: {
                type: 'string',
                example: 'My Organization',
              },
            },
          },
        },
      },
    },
    userPostResponse: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: 'user-id-value',
        },
        created_at: {
          type: 'string',
          example: '2012-07-14T01:00:00+01:00',
        },
        username: {
          type: 'string',
          example: 'myusername',
        },
        emails: {
          type: 'array',
          items: {
            $ref: '#/definitions/emailAddress',
          },
        },
        profile: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              example: 'My Company Ltd',
            },
          },
        },
      },
    },

  },
};

// Generate Swagger to route /rest/v1/swagger_maintenance.json
MaintenanceV1.addSwagger('swagger_maintenance.json');

export default MaintenanceV1;
