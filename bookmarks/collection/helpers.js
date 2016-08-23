import { ApiBackends } from '/apis/collection/backend';

ApiBookmarks.helpers({
  apis : function() {
    return ApiBackends.find({_id :{$in: this.apiIds}})
  }
});
