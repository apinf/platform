/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import {
  arrowDirection,
  percentageValue,
  summaryComparing,
} from '/apinf_packages/dashboard/lib/trend_helpers';

Template.dashboardOverviewStatistic.onCreated(function () {
  this.autorun(() => {
    // Get query parameter value
    const queryParamValue = FlowRouter.getQueryParam('timeframe');
    // Get timeframe value
    this.timeframe = queryParamValue.split('-')[0];
  });
});

Template.dashboardOverviewStatistic.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  overviewComparing (parameter) {
    const instance = Template.instance();

    return summaryComparing(parameter, this, instance.timeframe);
  },
  timeframeYesterday () {
    const instance = Template.instance();
    // Because typeof timeframe is string
    // TODO: Remake phrase "yesterday/last day" to "last 24 hour
    return instance.timeframe === '24';
  },
  timeframe () {
    const instance = Template.instance();

    return instance.timeframe;
  },
});
