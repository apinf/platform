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

  instance.autorun(() => {
    // Get API IDs
    const apiIds = Template.currentData().apiIds;

    // Update list of proxy backends
    const proxyBackends = ProxyBackends.find({ apiId: { $in: apiIds } }).fetch();

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
  tableTitle () {
    const title = Template.currentData().title;

    return TAPi18n.__(`dashboardSummaryStatistic_groupTitle_${title}`);
  },
  getCount (path, param) {
    const statusCodesResponse = Template.currentData().statusCodesResponse;
    const statusCodes = statusCodesResponse && statusCodesResponse[path];

    const totalNumberResponse = Template.currentData().totalNumberResponse;
    const totalNumber = totalNumberResponse && totalNumberResponse[path];

    let count;

    switch (param) {
      case 'success': {
        count = statusCodes ? statusCodes.successCallsCount : 0;
        break;
      }
      case 'error': {
        count = statusCodes ? statusCodes.errorCallsCount : 0;
        break;
      }
      case 'requests': {
        count = totalNumber ? totalNumber.requestNumber : 0;
        break;
      }
      case 'time': {
        count = totalNumber ? totalNumber.responseTime : 0;
        break;
      }
      case 'users': {
        count = totalNumber ? totalNumber.uniqueUsers : 0;
        break;
      }
      default: {
        count = 0;
        break;
      }
    }

    return count;
  },
  comparisonData (path) {
    const totalNumberResponse = Template.currentData().totalNumberResponse;
    const totalNumber = totalNumberResponse && totalNumberResponse[path];

    return totalNumber ? totalNumber.comparisons : {};
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
