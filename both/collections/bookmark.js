ApiBookmarks = new Mongo.Collection('apiBookmarks');

ApiBookmarks.helpers({
  apis : function() {
  return ApiBackends.find({_id :{$in: this.apiIds}})
}

});

ApiBookmarks.allow({
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
