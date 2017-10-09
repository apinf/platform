/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// APInf imports
import descriptionLoginLogout from '/apinf_packages/rest_apis/lib/descriptions/login_logout_texts';

const authentication = {
  login: {
    post: {
      tags: [
        'Authentication',
      ],
      summary: 'Logging in.',
      description: descriptionLoginLogout.login,
      produces: ['application/json'],
      parameters: [{
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
      }],
      responses: {
        200: {
          description: 'Logged in successfully',
          schema: {
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
        400: {
          description: 'Bad Request. Missing or erroneous parameter.',
        },
        401: {
          description: 'Authentication is required',
        },
      },
    },
  },

  logout: {
    post: {
      tags: [
        'Authentication',
      ],
      summary: 'Logging out.',
      description: descriptionLoginLogout.logout,
      produces: ['application/json'],
      responses: {
        200: {
          description: 'You\'ve been logged out!',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              message: {
                type: 'string',
                example: 'You\'ve been logged out!',
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Missing or erroneous parameter.',
        },
        401: {
          description: 'Unauthorized',
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
};


export default authentication;
