import { Template } from 'meteor/templating';

Template.proxyItem.events({
  'click #edit-proxy': function (event, instance) {
    const proxy = this.proxy;
    Modal.show('addProxy', { proxy, isEdit: true });
  },
  'click #remove-proxy': function (event, instance) {
    const proxy = this.proxy;
    Modal.show('removeProxy', { proxy });
  }
});

Template.proxyItem.helpers({
  equals (a, b) {
    return a === b;
  }
});
