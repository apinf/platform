import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Apinf imports
import { Proxies } from '../collection';

Template.proxies.onCreated(function () {
  const instance = this;

  instance.subscribe('allProxies');
});

Template.proxies.events({
  'click #add-proxy': function () {
    // Show the add proxy form
    Modal.show('proxyForm');
  },
});

Template.proxies.helpers({
  proxies () {
    // Get all proxies
    const proxies = Proxies.find().fetch();

    return proxies;
  },
  hideAddProxyButton () {
    const proxiesCount = Proxies.find().count();

    // Set button disabled if at least one proxy is already added
    return proxiesCount >= 1;
  },
});
