import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Apis } from '/apis/collection/collection';

import _ from 'lodash';

Template.dashboardChartsFiltering.onCreated(function () {

  // Get reference to template instance
  const instance = this;

  // Create reactive variable to keep API array
  instance.apis = new ReactiveVar();

  // Subscribe to publication
  instance.subscribe('myManagedApis');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // Update variable with data
      instance.apis.set(Apis.find().fetch());
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
