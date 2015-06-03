@ApiBackends = new Meteor.Collection('apiBackends');
Schemas.ApiBackends = new SimpleSchema(
  name:
    type: String
#
#  backend_protocol:
#    type: String
#    allowedValues:
#      'http'
#      'https'
#    label: 'Backend protocol'
#
#  backend_host:
#    type: String
#
#  backend_port:
#    type: Number
#
#  frontend_host:
#    type: String
#
#  server:
#    type: Array
#
#  "server.$":
#    type: Object
#
#  "server.$. backend_host":
#    type: String
#
#  "server.$.backend_port":
#    type: Number
)

ApiBackends.attachSchema(Schemas.ApiBackends)
