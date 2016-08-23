import { ApiBackends } from '/apis/collection/backend';

const ApiBookmarks = new Mongo.Collection('apiBookmarks');

export { ApiBookmarks };

ApiBookmarks.helpers({
  apis : function() {
    return ApiBackends.find({_id :{$in: this.apiIds}})
  }

});
