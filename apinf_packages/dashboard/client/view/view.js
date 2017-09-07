/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import _ from 'lodash';

// APInf imports
import queryForDashboardPage from './query';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Init variables
  instance.elasticsearchData = new ReactiveVar();
  instance.error = new ReactiveVar();
  instance.elasticsearchHost = new ReactiveVar();
  instance.proxyBackendPaths = new ReactiveVar();

  // Reactive update Elasticsearch host
  instance.autorun(() => {
    // Get proxy
    const proxy = Proxies.findOne();

    // Get relevant Elasticsearch host
    const host = _.get(proxy, 'apiUmbrella.elasticsearch', '');

    // Save it in reactive variable
    instance.elasticsearchHost.set(host);
  });

  // Reactive update Proxy Backends paths list
  instance.autorun(() => {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    // Create a list with requested paths
    const paths = _.map(proxyBackends, (backend) => {
      const requestPath = backend.apiUmbrella.url_matches[0].frontend_prefix;
      return {
        wildcard: {
          request_path: {
            // Add '*' to partially match the url
            // Remove the last slash
            value: `${requestPath.slice(0, -1)}*`,
          },
        },
      };
    });

    // Save it in reactive variable
    instance.proxyBackendPaths.set(paths);
  });

  instance.autorun(() => {
    const elasticsearchHost = instance.elasticsearchHost.get();
    // Make sure Host exists
    if (elasticsearchHost) {
      // Get list of proxy backends paths
      const proxyBackendPaths = instance.proxyBackendPaths.get();
      // Get timeframe
      const timeframe = FlowRouter.getQueryParam('timeframe');

      // Make query object
      const queryParams = queryForDashboardPage(proxyBackendPaths, timeframe);

      // Get Elasticsearch data
      Meteor.call('getElasticsearchData', elasticsearchHost, queryParams, (error, result) => {
        if (error) {
          instance.error.set(error);
          throw Meteor.Error(error);
        }

        // Update Elasticsearch data reactive variable with result
        instance.elasticsearchData.set(result);
      });
    }
  });
});

Template.dashboardView.helpers({
  elasticsearchData () {
    // Get reference to template instance
    const instance = Template.instance();

    // Return Elasticsearch data
    return instance.elasticsearchData.get();
  },
  fetchingData () {
    const instance = Template.instance();
    // Return status about error or elasticsearch data
    return instance.elasticsearchData.get() || instance.error.get();
  },
  error () {
    const instance = Template.instance();
    // Return value of error
    return instance.error.get();
  },
});
