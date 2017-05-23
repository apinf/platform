import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import Proxies from '/proxies/collection';

Template.emqUsers.onCreated(function () {
  const instance = this;

  instance.emqUsers = new ReactiveVar();
  instance.emqProxy = new ReactiveVar();

  const proxyId = instance.data.apiProxySettings.proxyId;

  instance.subscribe('proxyWithCredentials', proxyId);

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      const emqProxy = Proxies.findOne(proxyId);

      instance.emqProxy.set(emqProxy);

      const emqHttpApi = emqProxy.emq.httpApi;

      Meteor.call('getEmqUsers', emqHttpApi, (err, users) => {
        if (err) console.error(err);

        instance.emqUsers.set(users);
      });
    }
  });
});

Template.emqUsers.helpers({
  emqUsers () {
    const instance = Template.instance();
    return instance.emqUsers.get();
  },
  emqProxy () {
    const instance = Template.instance();
    return instance.emqProxy.get();
  },
});

Template.emqUsers.events({
  'click #remove-emq-user-confirmation': function (event, templateInstance) {
    event.preventDefault();

    const user = this;
    const emqProxy = templateInstance.emqProxy.get();
    const emqUsersReactive = templateInstance.emqUsers;

    Modal.show('removeEmqUser', { user, emqProxy, emqUsersReactive });
  },
  'click #add-emq-user-modal': function (event, templateInstance) {
    event.preventDefault();

    const emqProxy = templateInstance.emqProxy.get();
    const emqUsersReactive = templateInstance.emqUsers;

    Modal.show('addEmqUser', { emqProxy, emqUsersReactive });
  },
});
