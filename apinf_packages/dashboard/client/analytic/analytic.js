/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf import
import queryForAnalyticPage from './query';

Template.apiAnalyticPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.proxyBackendId = FlowRouter.getParam('proxyBackendId');

  // Subscribe to related Proxy Backend, API, Proxy instances
  instance.subscribe('proxyBackendRelatedData', instance.proxyBackendId);

  instance.elasticsearchData = new ReactiveVar();
  instance.error = new ReactiveVar();

  instance.autorun(() => {
    const proxyBackend = ProxyBackends.findOne(instance.proxyBackendId);

    // Make sure proxy backend is available
    if (proxyBackend) {
      // Storage Proxy ID and API ID
      instance.proxyId = proxyBackend.proxyId;
      instance.apiId = proxyBackend.apiId;

      const proxy = Proxies.findOne(instance.proxyId);

      // Make sure proxy is available
      if (proxy) {
        // Get request_path
        const proxyBackendPath = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;

        // Make query to Elasticsearch for this page
        const queryParams = queryForAnalyticPage(proxyBackendPath);

        // Get URL of relevant ElasticSearch
        const elasticsearchHost = proxy.apiUmbrella.elasticsearch;

        // Get Elasticsearch data
        Meteor.call('getElasticsearchData', elasticsearchHost, queryParams, (error, dataset) => {
          if (error) {
            instance.error.set(error);
            throw Meteor.Error(error);
          }
          // Update Elasticsearch data reactive variable with result
          instance.elasticsearchData.set(dataset.aggregations);
        });
      }
    }
  });
});

Template.apiAnalyticPage.helpers({
  elasticsearchData () {
    // Get reference to template instance
    const instance = Template.instance();

    // Return value of Elasticsearch host
    return instance.elasticsearchData.get();
  },
  fetchingData () {
    const instance = Template.instance();
    // Data is available if it has possitive or negative (error) result
    return instance.elasticsearchData.get() || instance.error.get();
  },
  error () {
    const instance = Template.instance();
    // Get value of error
    return instance.error.get();
  },
  proxyName () {
    const instance = Template.instance();

    const proxy = Proxies.findOne(instance.proxyId);

    return proxy.name;
  },
  api () {
    const instance = Template.instance();

    return Apis.findOne(instance.apiId);
  },
  dataAvailable () {
    const elasticsearchData = Template.instance().elasticsearchData.get();

    // Data exists if requests number(dco_count) is more than 0
    return elasticsearchData.group_by_interval.buckets.currentPeriod.doc_count > 0;
  },
  proxyBackendId () {
    const instance = Template.instance();

    return instance.proxyBackendId;
  },
});

