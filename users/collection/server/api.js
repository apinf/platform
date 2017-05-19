/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

// Generates: POST on /api/v1/users and GET, DELETE /api/v1/users/:id for
// Meteor.users collection
ApiV1.addRoute(Meteor.users, {
  getAll: {
    swagger: {
      description: 'Returns users',
      parameters: [
        ApiV1.swagger.params.optionalSearch,
        ApiV1.swagger.params.organization_id,
        ApiV1.swagger.params.skip,
        ApiV1.swagger.params.limit,
        ApiV1.swagger.params.sort_by,
      ],
      responses: {
        200: {
          description: 'users',
        },
        400: {
          description: 'Bad query parameters',
        },
      },
    },
    action () {
      const queryParams = this.queryParams;

      const query = {};
      const options = {};
      const searchCondition = {};

      // parse query parameters
      if (queryParams.organization_id) {
        // Get organization document with specified ID
        const organization = Organizations.findOne(queryParams.organization_id);

        // Make sure Organization exists
        if (organization) {
          // Get list of managed API IDs
          query._id = { $in: organization.managerIds };
        }
      }

      if (queryParams.limit) {
        options.limit = parseInt(queryParams.limit, 10);
      } else {
        // By default 100 users is returned
        options.limit = 100;
      }

      if (queryParams.skip) {
        options.skip = parseInt(queryParams.skip, 10);
      }

      // By default users are sorted by username
      if (!queryParams.sort_by ||
          queryParams.sort_by === 'username') {
        searchCondition.username = 1;
        options.sort = searchCondition;
      }

      if (queryParams.sort_by === 'created_at') {
        searchCondition.createdAt = 1;
        options.sort = searchCondition;
      }

      if (queryParams.sort_by === 'updated_at') {
        searchCondition.updatedAt = 1;
        options.sort = searchCondition;
      }

      // Pass an optional search string for looking up inventory.
      if (queryParams.q) {
        query.$or = [
          {
            username: {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
          {
            'profile.company': {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
          {
            'emails.address': {
              $regex: queryParams.q,
              $options: 'i', // case-insensitive option
            },
          },
        ];
      }
      // Get all users
      const userList = Meteor.users.find(query, options).fetch();
      // Get Organization names and ids for every User
      if (userList) {
        const userListLength = userList.length;
        // Loop through user list one by one
        for (let i = 0; i < userListLength; i++) {
          // Array for Organization name and id
          const orgDataList = [];
          // Get user id
          const userId = userList[i]._id;
          // Find all Organizations, where User belongs to
          const organizations = Organizations.find({
            managerIds: userId,
          }).fetch();
          // If there are Users' Organizations
          if (organizations.length > 0) {
            const organizationLength = organizations.length;
            // Loop through Users' Organizations
            for (let k = 0; k < organizationLength; k++) {
              const orgData = {};
              // Put Organization name and id into an object
              orgData.organization_id = organizations[k]._id;
              orgData.organization_name = organizations[k].name;
              // Add this Organization data into Users' organization data list
              orgDataList.push(orgData);
            }
            // Add Organizations' information to Users' data
            userList[i].organization = orgDataList;
          }
        }
      }
      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: userList,
        },
      };
    },

  },
  get: {
    swagger: {
      description: 'Returns user with given ID.',
      responses: {
        200: {
          description: 'One user.',
        },
      },
    },
  },
  post: {
    authRequired: false,
    swagger: {
      description: 'Add user.',
      responses: {
        200: {
          description: 'Return user that was added.',
        },
      },
    },
  },
  delete: {
    roleRequired: 'admin',
    swagger: {
      description: 'Delete user.',
      responses: {
        200: {
          description: 'Successful delete.',
        },
      },
    },
  },
});
