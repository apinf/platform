import { Apis } from '/apis/collection';
import { OrganizationApis } from './';

OrganizationApis.helpers({
  cursor () {
    // Return cursor to Apis
    return Apis.find({ _id: { $in: this.apiIds } });
  },
  count () {
    // Return number of organization apis
    return this.apiIds.length;
  },
});
