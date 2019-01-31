/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Npm packages imports
import _ from 'lodash';

Template.tenantUsersList.helpers({
  tenantUsers () {

    // Form list of tenant users
    /*
    let tenantUsers = [
      { username: 'Jorse',
        provider: true,
        consumer: false,
      },
      { username: 'Sepeteus',
        provider: true,
        consumer: false,
      },
      { username: 'Timoteus',
        provider: true,
        consumer: true,
      },
      { username: 'Ephraim',
        provider: false,
        consumer: true,
      },
    ];
    */
    const tenantUsers = JSON.parse(Session.get('tenantUsers'));   
    return tenantUsers;
  },
});

Template.tenantUsersList.events({
  'click .remove-tenant-user': function (event, templateInstance) {

    const selected = this;
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = JSON.parse(Session.get('tenantUsers'));  
    }

    // find object to be removed
    const result = tenantUsers.findIndex( user => {
      return user.username === selected.username &&
             user.consumer === selected.consumer &&
             user.provider === selected.provider;
    });
    // Remove user object from array
    tenantUsers.splice(result, 1);

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', JSON.stringify(tenantUsers));       
  },
});
