import { Meteor } from 'meteor/meteor';

import Apis from '/apis/collection';
import { ProxyBackends } from './';

ProxyBackends.helpers({
  currentUserIsManager () {
    // Get apiId
    const apiId = this.apiId;
    // Get API by apiId
    const api = Apis.findOne(apiId);
    // Check if current user is manager
    const isManager = api.currentUserIsManager();

    return isManager;
  },
});
