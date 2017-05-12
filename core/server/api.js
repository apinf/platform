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
    optionalSearch: {
      name: 'q',
      in: 'query',
      description: 'Pass an optional search string for looking up inventory.',
      required: false,
      type: 'string',
    },
    organization_id: {
      name: 'organization ID',
      in: 'query',
      description: 'Users of known organization',
      required: false,
      type: 'string',
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
    sort_by: {
      name: 'sort By',
      in: 'query',
      description: 'order of displaying users',
      required: false,
      type: 'string',
    },
  },
};

// Generate Swagger to route /rest-api/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
