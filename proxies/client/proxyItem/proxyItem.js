import { Template } from 'meteor/templating';

Template.proxyItem.events({
  'click #edit-proxy': function (event, instance) {
    // Get proxy document
    const proxy = this.proxy;

    // Show proxy form modal
    Modal.show('proxyForm', { proxy });
  },
  'click #remove-proxy': function (event, instance) {
    // Get proxy document
    const proxy = this.proxy;

    // Show remove proxy modal
    Modal.show('removeProxy', { proxy });
  },
});

Template.proxyItem.helpers({
  equals (a, b) {
    return a === b;
  },
});
