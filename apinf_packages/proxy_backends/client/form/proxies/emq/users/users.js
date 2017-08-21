/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Proxies from '/apinf_packages/proxies/collection';

Template.emqUsers.onCreated(function () {
  const instance = this;

  // Init reactive variable to handle emq users and current emq proxy
  instance.emqUsers = new ReactiveVar();
  instance.emqProxy = new ReactiveVar();

  // Get proxy ID from template instance
  const proxyId = instance.data.proxyId;

  // Subscribe to publication
  instance.subscribe('proxyWithCredentials', proxyId);

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // Fetch proxy by proxy ID
      const emqProxy = Proxies.findOne(proxyId);

      // Set proxy to reactive variable
      instance.emqProxy.set(emqProxy);

      // Get HTTP API URL from EMQ proxy
      const emqHttpApi = emqProxy.emq.httpApi;

      // Call method to get all users
      Meteor.call('getEmqUsers', emqHttpApi, (err, users) => {
        if (err) sAlert(err.message);

        // Uodate reactive variable instance
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
    // Prevent default form submit
    event.preventDefault();

    // Get user data from the context
    const user = this;

    // Get proxy data from reactive variable
    const emqProxy = templateInstance.emqProxy.get();
    // Get reactive variable instance that stores EMQ users
    const emqUsersReactive = templateInstance.emqUsers;

    // Show modal, and pass data to it
    Modal.show('removeEmqUser', { user, emqProxy, emqUsersReactive });
  },
  'click #add-emq-user-modal': function (event, templateInstance) {
    // Prevent default form submit
    event.preventDefault();

    // Get proxy data from reactive variable
    const emqProxy = templateInstance.emqProxy.get();
    // Get reactive variable instance that stores EMQ users
    const emqUsersReactive = templateInstance.emqUsers;

    // Show moda, and pass data to it
    Modal.show('addEmqUser', { emqProxy, emqUsersReactive });
  },
});
