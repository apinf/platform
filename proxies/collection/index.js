const Proxies = new Mongo.Collection('proxies');

Schemas.ProxiesSchema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String
  }
});
