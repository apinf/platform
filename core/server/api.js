/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'api',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration
// - meta, tags, params, definitions
ApiV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'Admin API',
    },
  },
  tags: {
    apis: 'Apis',
  },
  params: {
    apiId: {
      name: 'id',
      in: 'path',
      description: 'Api ID',
      required: true,
      type: 'string',
    },
  },
};

// Generate Swagger to route /rest-api/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
