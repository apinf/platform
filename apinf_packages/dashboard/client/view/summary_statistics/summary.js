/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import {
  arrowDirection,
  percentageValue,
} from '/apinf_packages/dashboard/lib/trend_helpers';

Template.dashboardSummaryStatistic.onCreated(function () {
  // Dictionary of Flags about display/not the overview part for current item
  const instance = this;

  // Dictionary of Flags about display/not the overview part for current item
  instance.displayOverview = new ReactiveDict();
  instance.proxyBackendsWithMetric = {};

  instance.autorun(() => {
    // Update list
    instance.proxyBackendsWithMetric = {};

    // Get API IDs
    const apiIds = Template.currentData().apiIds;

    // Update list of proxy backends
    const proxyBackends = ProxyBackends.find({ apiId: { $in: apiIds } }).fetch();

    // Get actual elasticsearch data
    const chartData = Template.currentData().chartData;

    proxyBackends.forEach(backend => {
      const proxyBackendPath = backend.frontendPrefix();

      // Create a list of proxy backends with metric for current timeframe
      chartData.forEach(dataset => {
        const path = dataset.requestPath;

        // Using indexOf to check when frontend prefix and request_path differ in a last slash
        const theSamePaths = proxyBackendPath.indexOf(path);
        // If paths are equal or differ in a last slash
        if (theSamePaths === 0) {
          // Save it
          instance.proxyBackendsWithMetric[proxyBackendPath] = dataset;
          // Add info about API name & slug and id of proxy backend
          instance.proxyBackendsWithMetric[proxyBackendPath].apiName = backend.apiName();
          instance.proxyBackendsWithMetric[proxyBackendPath].apiSlug = backend.apiSlug();
          instance.proxyBackendsWithMetric[proxyBackendPath].proxyBackendId = backend._id;
        }
      });
    });

    // Get the current language
    const language = TAPi18n.getLanguage();

    // Sort by name
    instance.proxyBackends = proxyBackends.sort((a, b) => {
      return a.apiName().localeCompare(b.apiName(), language);
    });
  });
});

Template.dashboardSummaryStatistic.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  textColor (parameter) {
    let textColor;
    const direction = arrowDirection(parameter, this);

    // Green color for text -  percentage value near arrow
    if (direction === 'arrow-up' || direction === 'arrow-down_time') {
      textColor = 'text-success';
    }

    // Red color for text - percentage value near arrow
    if (direction === 'arrow-down' || direction === 'arrow-up_time') {
      textColor = 'text-danger';
    }

    return textColor;
  },
  displayOverview (parameter) {
    const instance = Template.instance();

    return instance.displayOverview.get(parameter);
  },
  proxyBackends () {
    const instance = Template.instance();

    // Sort by name
    return instance.proxyBackends;
  },
  bucket (proxyBackendPath) {
    const instance = Template.instance();

    return instance.proxyBackendsWithMetric[proxyBackendPath];
  },
  tableTitle () {
    const title = Template.currentData().title;

    return TAPi18n.__(`dashboardSummaryStatistic_groupTitle_${title}`);
  },
});

Template.dashboardSummaryStatistic.events({
  'click [data-id]': (event, templateInstance) => {
    const target = event.currentTarget;

    // Get status of specified Overview template (shown or not)
    const display = templateInstance.displayOverview.get(target.dataset.id);

    // Inverse the value
    templateInstance.displayOverview.set(target.dataset.id, !display);

    // Display or not the box-shadow for table line
    target.classList.toggle('open');
  },
});
