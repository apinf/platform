import { Template } from 'meteor/templating';

Template.proxies.events({
  'click #add-proxy': function (event, instance) {
    Modal.show('addProxy');
  }
});
