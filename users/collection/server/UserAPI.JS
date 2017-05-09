/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import ApiV1 from '/core/server/api';

// Generates: POST on /api/users and GET, DELETE /api/users/:id for
// Meteor.users collection
ApiV1.addCollection(Meteor.users, {
  excludedEndpoints: ['getAll', 'put'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    post: {
      authRequired: true,
    },
    delete: {
      roleRequired: 'admin',
    },
  },
});
// Maps to: /api/v1/users
ApiV1.addRoute('users', { authRequired: true }, {
  get () {
  //  return Meteor.users.find().fetch();
  // Init response object
    let response = {};
    response = {
      statusCode: 200,
      body: {
        status: 'success',
        data: [{ name: 'test' }],
      },
    };

    return response;
  },
});
