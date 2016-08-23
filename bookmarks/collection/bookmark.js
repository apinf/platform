import { Apis } from '/apis/collection/apis';

ApiBookmarks = new Mongo.Collection('apiBookmarks');

ApiBookmarks.helpers({
  apis : function() {
    return Apis.find({_id :{$in: this.apiIds}})
  }

});
