import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ApiBackends } from '/apis/collection/backend';

import _ from 'lodash';
import moment from 'moment';

Template.dashboard.onCreated(function () {

  // Get reference to template instance
  const instance = this;

  // Handles ES data for charts
  instance.chartData = new ReactiveVar();

  const userId = Meteor.userId();

  if (Roles.userIsInRole(userId, ['admin'])) {

    // Subscribe to publication
    instance.subscribe('allApiBackends');
  } else {

    // Subscribe to publication
    instance.subscribe('myManagedApis');
  }

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {

      // Get APIs managed by user
      const apis = ApiBackends.find().fetch();

      // Init varuable to keep elasticsearch sub-query
      let prefixesQuery = [];

      // Iterate through eacy API managed by user
      _.forEach(apis, (api) => {
        // Push query object to array
        prefixesQuery.push({
          wildcard: {
            request_path: {
              // Add '*' to partially match the url
              value: `${api.url_matches[0].frontend_prefix}*`
            }
          }
        });
      });

      // Construct parameters for elasticsearch
      const params = {
        size: 50000,
        body: {
          query: {
            filtered: {
              query: {
                bool: {
                  should: [
                    prefixesQuery
                  ]
                }
              },
              filter: {
                range: {
                  request_at: {
                    gte: moment().subtract(30, 'day').valueOf()
                  }
                }
              }
            }
          },
          sort : [
            { request_at : { order : 'desc' }},
          ],
          fields: [
            'request_at',
            'response_status',
            'response_time',
            'request_ip_country',
            'request_ip',
            'request_path',
            'user_id'
          ]
        }
      }

      // Fetch elasticsearch data
      Meteor.call('getElasticSearchData', params, (err, res) => {

        if (err) throw new Meteor.error(err);

        // Get list of items for analytics
        const hits = res.hits.hits;

        // Update reactive variable
        instance.chartData.set(hits);
      });
    }
  });

});

Template.dashboard.helpers({
  chartData () {
    const instance = Template.instance();

    return instance.chartData.get();
  }
})
