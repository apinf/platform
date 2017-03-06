// Collection imports
import Apis from '/apis/collection';
import ApiBookmarks from './';

ApiBookmarks.helpers({
  apis () {
    return Apis.find({ _id: { $in: this.apiIds } });
  },
});
