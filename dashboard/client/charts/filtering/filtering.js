import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ProxyBackends } from '/proxy_backends/collection';

import _ from 'lodash';

Template.dashboardChartsFiltering.onCreated(function () {

  // Get reference to template instance
  const instance = this;

  // Create reactive variable to keep API array
  instance.apis = new ReactiveVar();

  // Subscribe to publication
  instance.subscribe('proxyApis');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      const proxyBackends = ProxyBackends.find().fetch();
      // Update variable with data
      const apis = _.map(proxyBackends, proxyBackend => {
        const api = proxyBackend.apiUmbrella;
        api._id = proxyBackend.apiId;
        return api;
      });
      instance.apis.set(apis);
    }
  });
});

Template.dashboardChartsFiltering.helpers({
  apis () {

    // Get reference to template instance
    const instance = Template.instance();

    return instance.apis.get();
  }
});
