/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Proxies from '../collection';

Template.proxies.onCreated(function () {
  const instance = this;

  instance.subscribe('allProxies');
});

Template.proxies.events({
  'click #add-proxy': function () {
    // Show the add proxy form
    Modal.show('proxyForm');
  },
});

Template.proxies.helpers({
  proxies () {
    // Get all proxies
    const proxies = Proxies.find().fetch();

    return proxies;
  },
});
