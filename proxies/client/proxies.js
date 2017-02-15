// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Proxies from '../collection';

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
});
