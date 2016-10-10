import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ProxyBackends } from '/proxy_backends/collection';

import _ from 'lodash';

Template.dashboardChartsFiltering.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to publication
  instance.subscribe('proxyApis');

  // Keeps APIs managed by user
  instance.apisManagedByUser = new ReactiveVar();
  // Keeps other APIs
  instance.otherApis = new ReactiveVar();

  instance.fetchApis = () => {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    // Placeholders for APIs
    const apisManagedByUser = [];
    const otherApis = [];

    // Update variable with data
    _.forEach(proxyBackends, (proxyBackend) => {

      // Get apiUmbrella object
      const umbrellaApi = proxyBackend.apiUmbrella;

      // Attach _id field to apiUmbrella object
      umbrellaApi._id = proxyBackend.apiId;

      // Check user permissions for each API
      // push it to related opt group
      if (proxyBackend.currentUserIsManager()) {
        apisManagedByUser.push(umbrellaApi);
      } else {
        otherApis.push(umbrellaApi);
      }
    });

    // Update reactive variables
    instance.apisManagedByUser.set(apisManagedByUser);
    instance.otherApis.set(otherApis);
  };

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.fetchApis();
    }
  });
});

Template.dashboardChartsFiltering.helpers({
  otherApis () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.otherApis.get();
  },
  userApis () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.apisManagedByUser.get();
  },
});
