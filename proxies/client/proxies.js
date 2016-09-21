import { Proxies } from '../collection';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.proxies.onCreated(function () {
  const instance = this;

  instance.proxies = new ReactiveVar();
  instance.isDisabled = new ReactiveVar();

  instance.subscribe('allProxies');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // Update reactive vatiable with proxies cursor when subscription is ready
      instance.proxies.set(Proxies.find());

      // Get proxies count
      const proxiesCount = Proxies.find().count();

      // Set button disabled if at least one proxy is already added
      instance.isDisabled.set(proxiesCount >= 1);
    }
  });
});

Template.proxies.events({
  'click #add-proxy': function (event, instance) {
    Modal.show('addProxy', { proxy: {}, isEdit: false });
  },
});

Template.proxies.helpers({
  proxies () {
    const instance = Template.instance();
    return instance.proxies.get();
  },
  isDisabled () {
    const instance = Template.instance();
    return instance.isDisabled.get();
  },
});
