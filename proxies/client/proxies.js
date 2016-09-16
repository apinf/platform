import { Proxies } from '../collection';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.proxies.onCreated(function () {
  const instance = this;

  instance.proxies = new ReactiveVar();

  instance.subscribe('allProxies');
});

Template.proxies.events({
  'click #add-proxy': function (event, instance) {
    Modal.show('addProxy');
  },
});

Template.proxies.helpers({
  proxies () {
    // Get all proxies
    const proxies = Proxies.find().fetch();

    return proxies;
  },
});
