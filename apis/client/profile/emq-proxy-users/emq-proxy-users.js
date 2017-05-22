import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import Proxies from '/proxies/collection';

import helpers from './helpers/';

Template.emqProxyUsers.onCreated(function () {
  const instance = this;

  instance.emqUsers = new ReactiveVar();

  const proxyBackend = instance.data.proxyBackend;

  instance.subscribe('proxyWithCredentials', proxyBackend.proxyId);

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      const emqProxy = Proxies.findOne(proxyBackend.proxyId);

      const emqHttpApi = emqProxy.emq.httpApi;

      const { url, auth } = helpers.getUrlAndAuthStrings(emqHttpApi);

      Meteor.call('getEmqUsers', url, auth, (err, users) => {
        if (err) console.error(err);

        instance.emqUsers.set(users);
      });
    }
  });
});

Template.emqProxyUsers.helpers({
  emqUsers () {
    const instance = Template.instance();
    return instance.emqUsers.get();
  },
});
