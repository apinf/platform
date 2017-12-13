/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.dashboardPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('dashboardPage_title_dashboard');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });

  instance.proxiesList = new ReactiveVar();
  instance.countdown = new ReactiveVar();
  instance.timeInterval = new ReactiveVar(null);
  instance.reload = new ReactiveVar(true);

  // Create Chart reload countdown


  // Get proxy ID value from query params
  const proxyId = FlowRouter.getQueryParam('proxy_id');
  // Set type of proxy is API Umbrella
  const proxyType = 'apiUmbrella';

  Meteor.call('getProxiesList', proxyType, (error, result) => {
    // if proxy id value isn't available from Query param then
    // Set the first item of list as the default value
    // Make sure Proxies list is not empty
    if (!proxyId && result.length > 0) {
      // Modify the current history entry instead of creating a new one
      FlowRouter.withReplaceState(() => {
        // Set the default value for query parameter
        FlowRouter.setQueryParams({ proxy_id: result[0]._id });
      });
    }

    // Save result to template instance
    instance.proxiesList.set(result);
  });

  instance.autorun(() => {
    const currentProxyId = FlowRouter.getQueryParam('proxy_id');
    // Make sure value exists
    if (currentProxyId) {
      // Subscribe to proxy, related backends, related APIs
      instance.subscribe('proxyById', currentProxyId);
    }
  });
});
let i = 0;
Template.dashboardPage.onRendered(function () {
  const instance = this;
  instance.autorun(() => {
    if (instance.reload.get()) {
      Meteor.call('getPeriod', (error, result) => {
        if (error) {
          // Alert failure message to user
          sAlert.error(error);
        } else {
          let period = result.period;
          const startDate = new Date();
          const endtime = Date.parse(new Date(startDate.getTime() + (period * 60000)));
          instance.timeInterval.set(setInterval(() => {
            instance.reload.set(false);
            // Construct countdown
            const currentTime = Date.parse(new Date());
            const remainingTime = endtime - currentTime;
            const seconds = Math.floor((remainingTime / 1000) % 60);
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);

            // Clear timeinterval
            if (remainingTime <= 1) {
              clearInterval(instance.timeInterval.get());
              const proxyType = 'apiUmbrella';
              Meteor.call('getProxiesList', proxyType, (error, result) => {
                // if proxy id value isn't available from Query param then
                // Set the first item of list as the default value
                // Make sure Proxies list is not empty
                if (result.length > 0) {
                  // Modify the current history entry instead of creating a new one
                  FlowRouter.withReplaceState(() => {
                    // Set the default value for query parameter
                    FlowRouter.setQueryParams({ proxy_id: result[0]._id });
                  });
                }

                // Save result to template instance
                instance.proxiesList.set(result);
                instance.reload.set(true);
              });
              // Page reload
              // location.reload();
            }
            const countdown = {
              minutes,
              seconds,
            };

            // Save countdown to template instance
            instance.countdown.set(countdown);
          }, 1000));
        }
      });
    }
  });
})

Template.dashboardPage.onDestroyed(function () {
  const instance = this;
  if (instance.timeInterval.get()) {
    clearInterval(instance.timeInterval.get());
  }
});

Template.dashboardPage.helpers({
  proxyBackendsCount () {
    // Fetch proxy backends
    return ProxyBackends.find().count();
  },
  managedApisCount () {
    // Return count of managed APIs
    return Apis.find().count();
  },
  proxiesList () {
    const instance = Template.instance();

    // Return list of available proxies
    return instance.proxiesList.get();
  },
  managedOneApi () {
    return ProxyBackends.find().count() === 1;
  },
  proxyBackendId () {
    return ProxyBackends.findOne()._id;
  },
  countdown () {
    const instance = Template.instance();

    // Return list of countdown
    return instance.countdown.get();
  },
});
