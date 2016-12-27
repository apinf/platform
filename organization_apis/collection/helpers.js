import _ from 'lodash';
import { Apis } from '/apis/collection';
import { OrganizationApis } from './';

OrganizationApis.helpers({
  listApis () {
    // Map array of apis
    const apis = _.map(this.apiIds, (apiId) => Apis.find({ _id: apiId }).fetch());
    // Return array of apis
    return apis;
  },
  count () {
    // Return number of organization apis
    return this.apiIds.length;
  },
});
