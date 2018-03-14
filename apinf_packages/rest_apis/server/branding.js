/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

// APInf imports
import descriptionBranding from '/apinf_packages/rest_apis/lib/descriptions/branding_texts';

const BrandingV1 = new Restivus({
  apiPath: 'rest',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

BrandingV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      description: descriptionBranding.general,
      version: '1.0.0',
      title: 'Branding APInf site',
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
    authentication: 'Authentication',
    branding: 'Branding',
  },
  params: {
    branding: {
      name: 'branding',
      in: 'body',
      description: 'Data for adding or editing Branding configuration',
      schema: {
        $ref: '#/definitions/branding',
      },
    },
  },
  definitions: {
    // The schema defining the type used for the body parameter in POST or PUT method
    branding: {
      properties: {
        siteTitle: {
          type: 'string',
          example: 'Site title',
        },
        siteSlogan: {
          type: 'string',
          example: 'Site slogan',
        },
        siteFooter: {
          type: 'string',
          example: 'Site footer',
        },
        primary: {
          type: 'string',
          description: 'A primary background color of site theme',
          example: '#343099',
        },
        primaryText: {
          type: 'string',
          description: 'A primary text color of site theme',
          example: '#ffffff',
        },
        coverPhotoOverlay: {
          type: 'string',
          description: 'A color to overlay the cover photo',
          example: '#dfdbff',
        },
        overlayTransparency: {
          type: 'number',
          description: 'A transparency value to overlay color',
          example: '10',
        },
        featuredApis: {
          type: 'string',
          description: 'Provide IDs of public APIs that. The maximum value is 8',
          example: 'api-id, api2-id, api3-id',
        },
        facebook: {
          type: 'string',
          format: 'url',
        },
        twitter: {
          type: 'string',
          format: 'url',
        },
        github: {
          type: 'string',
          format: 'url',
        },
      },
    },
    brandingResponse: {
      type: 'object',
      properties: {
        siteTitle: {
          type: 'string',
          example: 'Site title',
        },
        siteSlogan: {
          type: 'string',
          example: 'Site slogan',
        },
        siteFooter: {
          type: 'string',
          example: 'Site footer',
        },
        colors: {
          type: 'object',
          properties: {
            primary: {
              type: 'string',
              description: 'A primary background color of site theme',
              example: '#343099',
            },
            primaryText: {
              type: 'string',
              description: 'A primary text color of site theme',
              example: '#ffffff',
            },
            coverPhotoOverlay: {
              type: 'string',
              description: 'A color to overlay the cover photo',
              example: '#dfdbff',
            },
            overlayTransparency: {
              type: 'number',
              description: 'A transparency value to overlay color',
              example: '10',
            },
          },
        },
        featuredApis: {
          type: 'array',
          items: {
            type: 'string',
            example: 'api-id',
          },
        },
        socialMedia: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Social media name',
                example: 'Facebook, twitter or github',
              },
              url: {
                type: 'string',
                format: 'url',
              },
            },
          },
        },
        siteLogoUrl: {
          type: 'string',
        },
        coverPhotoUrl: {
          type: 'string',
        },
        privacyPolicy: {
          type: 'string',
          description: 'Privacy Policy text',
        },
        termsOfUse: {
          type: 'string',
          description: 'Terms of Use text',
        },
        homeCustomBlock: {
          type: 'string',
          description: 'Block to display information',
        },
        footerCode: {
          type: 'string',
          description: 'Script for analytics code',
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

// Generate Swagger to route /rest/v1/branding.json
BrandingV1.addSwagger('branding.json');

export default BrandingV1;
