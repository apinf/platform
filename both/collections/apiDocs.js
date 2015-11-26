ApiDocs = new Mongo.Collection('apiDocs');

ApiDocs.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  }
});

