// Meteor package imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Apinf import
import { Proxies } from '/proxies/collection';

// Storage proxy id for current proxy backend configuration
const proxyId = new ReactiveVar('');

Template.selectProxy.onCreated(function () {
  // Check: if current proxy backend configuration has already proxy
  const currentProxyId = this.data.apiProxySettings ? this.data.apiProxySettings.proxyId : '';
  // Save result
  proxyId.set(currentProxyId);
});

Template.selectProxy.helpers({
  proxyList () {
    // Get a single Proxy
    const proxies = Proxies.find().fetch();
    // List for storage the proxies name
    const proxyList = [{
      name: 'No one proxy',
      selected: '',
    }];

    if (proxies) {
      // Set placeholder for selected option
      let selectedOption = '';
      // Get proxy id for current proxy backend configuration
      const currentProxyId = proxyId.get();

      _.forEach(proxies, (proxy) => {
        // Check: if proxy backend has already proxy, then selected this in list
        selectedOption = proxy._id === currentProxyId ? 'selected' : '';
        // Fill the proxy list
        proxyList.push({
          name: proxy.name,
          selected: selectedOption
        });
      });
    }
    return proxyList;
  },
});

Template.selectProxy.events({
  'change #select-proxy': function (event, templateInstance) {
    // Get selected option
    const selectedItem = event.target.value;
    let currentProxyId = '';

    console.dir(event.target)

    if (selectedItem !== event.target[0].value) {
      // Find the proxy with the selected name
      const proxy = Proxies.findOne({ name: selectedItem });
      currentProxyId = proxy._id;
    }

    // Check: if user changes current proxy to another
    if (templateInstance.data.formType === 'update') {
      // Notify users about changing proxy
      const confirmation = confirm('Do you want to change proxy?');
      // Check if user clicked "OK"
      if (confirmation === true) {
        // Update proxy id
        proxyId.set(currentProxyId);
      } else {
        // TODO: don't let to change item in dropdown list
      }
    } else {
      // Update proxy id
      proxyId.set(currentProxyId);
    }
    return true;
  },
});

export default proxyId;