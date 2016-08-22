import { ApiBackends } from '/apis/collection/backend';

ApiBookmarks = new Mongo.Collection('apiBookmarks');

ApiBookmarks.helpers({
  apis : function() {
    return ApiBackends.find({_id :{$in: this.apiIds}})
  }

});
