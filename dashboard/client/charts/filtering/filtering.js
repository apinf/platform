import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ProxyBackends } from '/proxy_backends/collection';

import _ from 'lodash';

Template.dashboardChartsFiltering.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.apisManagedByUser = new ReactiveVar();

  instance.otherApis = new ReactiveVar();

  // Subscribe to publication
  instance.subscribe('proxyApis');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      const proxyBackends = ProxyBackends.find().fetch();

      const apisManagedByUser = [];
      const otherApis = [];

      // Update variable with data
      _.forEach(proxyBackends, (proxyBackend) => {
        const umbrellaApi = proxyBackend.apiUmbrella;
        umbrellaApi._id = proxyBackend.apiId;

        if (proxyBackend.currentUserIsManager()) {
          apisManagedByUser.push(umbrellaApi);
        } else {
          otherApis.push(umbrellaApi);
        }
      });

      instance.apisManagedByUser.set(apisManagedByUser);
      instance.otherApis.set(otherApis);
    }
  });
});

Template.dashboardChartsFiltering.helpers({
  apisManagedByUser () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.apisManagedByUser.get();
  },
  otherApis () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.otherApis.get();
  },
});
