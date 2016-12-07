import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'rest-api/v1',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: false,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration
// - meta, definitions, params, tags
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
};

// Generate Swagger to route /rest-api/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default { ApiV1 };
