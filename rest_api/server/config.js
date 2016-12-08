import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'rest-api',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: false,
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
      title: 'Apika API',
      description: 'Apika REST API',
      termsOfService: 'https://apika.digipalvelutehdas.fi/terms/',
      contact: {
        name: 'Apika team',
      },
      license: {
        name: 'MIT',
      },
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

export { ApiV1 };
