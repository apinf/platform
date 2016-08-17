import { Proxies } from '../collection';
import proxiesList from '../default/list';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.proxies.onCreated(function(){
  const instance = this;

  instance.proxies = new ReactiveVar();

  instance.subscribe('allProxies');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.proxies.set(Proxies.find());
    }
  });
});

Template.proxies.events({
  'click #add-proxy': function (event, instance) {
    Modal.show('addProxy', { proxy: {}, isEdit: false });
  },
  'click #edit-proxy': function (event, instance) {
    const proxy = this;
    Modal.show('addProxy', { proxy, isEdit: true });
  },
  'click #remove-proxy': function (event, instance) {
    const proxy = this;
    Modal.show('removeProxy', { proxy });
  }
});


Template.proxies.helpers({
  proxies () {
    const instance = Template.instance();
    return instance.proxies.get();
  },
  roxiesList () {
    return proxiesList;
  },
  equals (a, b) {
    return a === b;
  }
});
