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
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Settings from '/apinf_packages/settings/collection';

Template.dashboardPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.proxiesList = new ReactiveVar();

  //const settings = Settings.findOne();
  //const period = settings.pageReloadTime;

  const currDate = new Date();
  const endtime = Date.parse(new Date(currDate.getTime() + (1 * 60000)));
  timeinterval = setInterval(function () {
    const currenttime = Date.parse(new Date());
    Session.set("time", currenttime);
    const contdown = getTimeRemaining(endtime);
    Session.set("contdown", contdown);
    console.log(contdown);
  }, 1000);

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

Template.dashboardPage.onRendered(function () {

  /*const currentDate = new Date();

  // 10 min interval
  const timeinterval = 1 * 60 * 1000
  const countDownDate = new Date(currentDate.getTime() + timeinterval);

  // Update the count down every 1 second
  let intervalObj = setInterval(function() {
    // Get todays date and time
    const now = new Date().getTime();

    // Find the distance between now an the count down date
    const distance = countDownDate - now;

    // Time calculations for minutes and seconds
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="countdown"
    document.getElementById("countdown").innerHTML ="Page reload in " + minutes + "m " + seconds + "s ";

    // If the count down is over, write some text
    if (distance < 1) {
      clearInterval(intervalObj);
      //document.getElementById("countdown").innerHTML ="Page reload in 0m 0s";

      // Redirect to Dashboard
      location.reload();
    }
  }, 1000);*/

  /*const currDate = new Date();
  const endtime = Date.parse(new Date(currDate.getTime() + (1 * 60000)));
  timeinterval = setInterval(function () {
    const currenttime = Date.parse(new Date());
    Session.set("time", currenttime);
    const contdown = getTimeRemaining(endtime);
    Session.set("contdown", contdown);
    console.log(contdown);
  }, 1000);*/
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
  countdown: function () {
      return Session.get("contdown");
  },
});

Template.dashboardPage.onDestroyed(function () {
    clearInterval(timeinterval);
});

function getTimeRemaining(endtime){
  // get endtime
  const interval = endtime - Session.get('time');
  const seconds = ("0" + Math.floor( (interval/1000) % 60 )).slice(-2);
  const minutes = ("0" + Math.floor( (interval/1000/60) % 60 )).slice(-2);

  if(interval <= 1) {
    clearInterval(this.timeinterval);
    // Redirect to Dashboard
    location.reload();
    // Redirect to Dashboard
    //FlowRouter.go('dashboard');
  }

  return {
    'total': interval,
    'minutes': minutes,
    'seconds': seconds
  };
}
