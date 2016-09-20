import { Proxies } from '../collection';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.proxies.onCreated(function () {
  const instance = this;

  instance.subscribe('allProxies');
});

Template.proxies.events({
  'click #add-proxy': function (event, instance) {
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
