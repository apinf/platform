/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// NPM imports
import moment from 'moment';

// Collections imports
import StoredTopics from '/apinf_packages/mqtt_dashboard/collection';

// APInf imports
import { arrowDirection, calculateTrend, percentageValue }
from '/apinf_packages/dashboard/lib/trend_helpers';
import { getDateRange } from '../../../lib/helpers';

Template.topicPage.onCreated(function () {
  const instance = this;
  instance.startDay = '';

  instance.eventType = new ReactiveVar('message_published');
  instance.timeframe = '24';
  instance.resetChart = false;

  instance.error = new ReactiveVar();
  instance.chartDataReady = new ReactiveVar();
  instance.statisticsReady = new ReactiveVar();

  instance.trend = new ReactiveVar({});
  instance.topic = new ReactiveVar();
  instance.chartData = new ReactiveVar();
  instance.previousPeriod = new ReactiveVar();
  instance.summaryStatistics = new ReactiveVar();

  instance.dateHistogramRequest = (eventType, topic) => {
    const params = {
      timeframe: instance.timeframe,
      dataType: 'histogram',
      topic,
      eventType,
    };

    // Fetch & process data
    Meteor.call('fetchHistogramTopicData',
      instance.queryOption, params, (error, result) => {
        // Mark data is ready
        instance.chartDataReady.set(true);

        if (error) {
          // Display message error
          const message = `Fetching chart data fails. ${error.message}`;
          sAlert.error(message);
        } else {
          // Update Chart data
          instance.chartData.set({
            reset: instance.resetChart,
            dataset: result,
          });

          instance.resetChart = false;
        }
      });
  };

  instance.totalNumberRequest = (dateRange, periodType, topic) => {
    const params = {
      timeframe: instance.timeframe,
      dataType: periodType,
      topic,
    };

    // Fetch & process data
    Meteor.call('fetchSummaryStatisticsTopic',
      dateRange, params, (error, result) => {
        if (error) {
          // Display message error
          const message = `Fetching ${periodType} summary statistics fails. ${error.message}`;
          sAlert.error(message);
          throw Meteor.Error(error.message);
        }

        if (periodType === 'current') {
          // Mark data is ready
          instance.statisticsReady.set(true);
          // Store data for Current Period
          instance.summaryStatistics.set(result);
        } else {
          // Store data for Previous Period
          instance.previousPeriod.set(result);
        }
      });
  };

  instance.summaryStatisticsData = () => {
    const topic = instance.topic.get();
    // Calculate date range for current period
    instance.queryOption = getDateRange(instance.timeframe);
    // Get data for current period
    instance.totalNumberRequest(instance.queryOption, 'current', topic);

    // Make date range for previous period
    const previousPeriodRange = {
      from: instance.queryOption.doublePeriodAgo,
      to: instance.queryOption.onePeriodAgo,
    };
    // Get data for previous period
    instance.totalNumberRequest(previousPeriodRange, 'previous', topic);
  };

  instance.allTopicData = () => {
    // Turn off real-time update
    clearInterval(instance.intervalId);

    instance.error.set();
    instance.chartDataReady.set(false);
    instance.statisticsReady.set(false);

    // Update queryOption
    instance.queryOption = getDateRange(instance.timeframe);
    instance.startDay = instance.queryOption.from;

    // Make sure ES is available
    Meteor.call('emqElasticsearchPing', (error) => {
      if (error) {
        // Mark data is ready
        instance.chartDataReady.set(true);
        // Display error
        instance.error.set(error.message);
        throw new Meteor.Error(error.message);
      }

      const topic = instance.topic.get();
      const eventType = instance.eventType.get();

      // Send request for chart data
      instance.dateHistogramRequest(eventType, topic);

      // Summary statistics data
      instance.summaryStatisticsData();

      // Real time mode is on
      if (instance.timeframe === '1') {
        // Turn on real-time update
        instance.intervalId = setInterval(() => {
          instance.queryOption.interval = 'minute';
          instance.queryOption.from = instance.queryOption.to;
          instance.queryOption.to = moment(instance.queryOption.from).add(1, 'm').valueOf();

          const dateRange = {
            from: instance.startDay,
            to: instance.queryOption.to,
          };

          // Send request for chart data
          instance.dateHistogramRequest(eventType, topic);
          // Update Total numbers of requests as well
          instance.totalNumberRequest(dateRange, 'current', topic);
        }, 60000);
      }
    });
  };

  // Subscrube to ACL document
  instance.autorun(() => {
    const topicId = FlowRouter.getParam('id');

    if (topicId) {
      const subscription = instance.subscribe('particularTopic', topicId);

      const isReady = subscription.ready();

      if (isReady) {
        const topicItem = StoredTopics.findOne(topicId);

        instance.topic.set(topicItem.value);

        instance.allTopicData();
      }
    }
  });

  // Update compare data
  instance.autorun(() => {
    // Get data for Previous period
    const previousPeriod = instance.previousPeriod.get();
    // Get data for Current period
    const currentPeriod = instance.summaryStatistics.get();

    if (previousPeriod && currentPeriod) {
      const compareData = {
        incomingBandwidth: calculateTrend(
          previousPeriod.incomingBandwidth, currentPeriod.incomingBandwidth
        ),
        outgoingBandwidth: calculateTrend(
          previousPeriod.outgoingBandwidth, currentPeriod.outgoingBandwidth
        ),
        publishedMessages: calculateTrend(
          previousPeriod.publishedMessages, currentPeriod.publishedMessages
        ),
        deliveredMessages: calculateTrend(
          previousPeriod.deliveredMessages, currentPeriod.deliveredMessages
        ),
        subscribedClients: calculateTrend(
          previousPeriod.subscribedClients, currentPeriod.subscribedClients
        ),
        publishedClients: calculateTrend(
          previousPeriod.publishedClients, currentPeriod.publishedClients
        ),
      };
      instance.trend.set(compareData);
    }
  });
});

Template.topicPage.onDestroyed(function () {
  clearInterval(this.intervalId);
});

Template.topicPage.helpers({
  arrowDirection (param) {
    const trend = Template.instance().trend.get();

    return arrowDirection(param, trend);
  },
  percentageValue (param) {
    const trend = Template.instance().trend.get();

    return percentageValue(param, trend);
  },
  textColor (param) {
    const trend = Template.instance().trend.get();

    const direction = arrowDirection(param, trend);

    return direction === 'arrow-up' ? 'text-green' : 'text-red';
  },
  topicValue () {
    return Template.instance().topic.get();
  },
  realTimeMode () {
    const timeframe = Template.instance().timeframe;

    return timeframe === '1';
  },
  chartDataReady () {
    return Template.instance().chartDataReady.get();
  },
  chartData () {
    return Template.instance().chartData.get();
  },
  statisticsReady () {
    return Template.instance().statisticsReady.get();
  },
  totalNumber (param) {
    const data = Template.instance().summaryStatistics.get();

    // Return data for particular event type
    return data[param].toLocaleString();
  },
  error () {
    return Template.instance().error.get();
  },
  format () {
    const timeframe = Template.instance().timeframe;

    return timeframe === '24' ? 'HH:mm' : 'DD.MM';
  },
  selectedType (type) {
    const selectedType = Template.instance().eventType.get();

    return type === selectedType ? 'event-type-active' : '';
  },
  queryOptions () {
    const timeframe = Template.instance().timeframe;

    return getDateRange(timeframe);
  },
});

Template.topicPage.events({
  'click .event-type': (event, templateInstance) => {
    const currentType = templateInstance.eventType.get();
    const selectedType = event.currentTarget.dataset.type;

    // Update only if selected type is not the same as current one
    if (currentType !== selectedType) {
      clearInterval(templateInstance.intervalId);

      templateInstance.eventType.set(selectedType);
      // Mark data is fetching
      templateInstance.chartDataReady.set(false);
      // reset charts if there is real time mode
      templateInstance.resetChart = true;
      // Update all data
      templateInstance.allTopicData();
    }
  },
  'change #date-range-picker': (event, templateInstance) => {
    templateInstance.timeframe = event.currentTarget.value;

    // reset charts if there is real time mode
    templateInstance.resetChart = true;
    // Update all data
    templateInstance.allTopicData();
  },
  'click #reload-chart': (event, templateInstance) => {
    // reset charts if there is real time mode
    templateInstance.resetChart = true;
    // Update all data
    templateInstance.allTopicData();
  },
});
