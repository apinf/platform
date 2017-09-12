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
} from '/apinf_packages/dashboard/client/trend_helpers';

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
    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    return summaryComparing(parameter, this, currentTimeframe);
  },
  timeframeYesterday () {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Because typeof timeframe is string
    return timeframe === '1';
  },
  timeframe () {
    return FlowRouter.getQueryParam('timeframe');
  },
});
