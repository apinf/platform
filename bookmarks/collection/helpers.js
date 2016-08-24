import { ApiBookmarks } from './';
import { Apis } from '/apis/collection';

ApiBookmarks.helpers({
  apis : function() {
    return Apis.find({_id :{$in: this.apiIds}})
  }
});
