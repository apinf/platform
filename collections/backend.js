ApiBackends = new Meteor.Collection('apiBackends');
Schemas.ApiBackends = new SimpleSchema({
  name: {
    type: String
  },
  backend_protocol: {
    type: String,
    allowedValues: ['http', 'https'],
    label: 'Backend protocol'
  },
  backend_host: {
    type: String
  },
  backend_port: {
    type: Number
  },
  frontend_host: {
    type: String
  },
  server: {
    type: [Object]
  },
  "server.$.backend_host": {
    type: String
  },
  "server.$.backend_port": {
    type: String,
    regEx: /^[0-9]{2,5}$/
  },
  matching: {
    type: [Object]
  },
  "matching.$.frontend_prefix": {
    label: 'Frontend Prefix',
    type: String
  },
  "matching.$.backend_prefix": {
    label: 'Backend Prefix',
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  }
});

ApiBackends.attachSchema(Schemas.ApiBackends)
