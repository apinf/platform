import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

import { Apis } from '/apis/collection';
import { ProxyBackends } from './';

ProxyBackends.helpers({
  currentUserIsManager () {
    const userId = Meteor.userId();

    const apiId = this.apiId;

    const api = Apis.findOne(apiId);

    const isManager = _.includes(api.managerIds, userId);

    return isManager;
  },
});
