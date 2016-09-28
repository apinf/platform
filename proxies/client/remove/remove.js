import { Template } from 'meteor/templating';
import { Proxies } from '../../collection';

Template.removeProxy.events({
  'click #confirm-remove-proxy': function (event, instance) {

    Proxies.remove(instance.data.proxy._id);

    Modal.hide('removeProxy');
  }
});
