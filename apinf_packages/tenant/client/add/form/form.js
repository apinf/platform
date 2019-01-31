/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

Template.tenantUserForm.events({
  'click #addTenantUser': function (event, templateInstance) {

    console.log('index=', $('#completeUserList')[0].selectedIndex);

    if ($('#completeUserList')[0].selectedIndex < 0) {
      sAlert.error("You must select a user!", { timeout: 'none' });
    } else {
      console.log('con=', $('#userRoleConsumer:checked').val());
      console.log('pro=', $('#userRoleProvider:checked').val());
      console.log('name=', $('#completeUserList option:selected').text());
 
      const newUser = {
        username: $('#completeUserList option:selected').text(),
        provider: $('#userRoleProvider:checked').val() || false,
        consumer: $('#userRoleConsumer:checked').val() || false,
      };
 
      // uncheck fields
      $('#completeUserList option:selected').prop('selected', false)
      $('#userRoleProvider').prop('checked', false);
      $('#userRoleConsumer').prop('checked', false);

      let tenantUsers = [];
      // Get possible previous users of tenant
      if (Session.get('tenantUsers')) {
        tenantUsers = JSON.parse(Session.get('tenantUsers'));  
      }
 
      // Add new user object to array
      tenantUsers.unshift(newUser);
 
      // Save to localStorage to be used while listing users of tenant
      Session.set('tenantUsers', JSON.stringify(tenantUsers));   
    }

  },
});

Template.tenantUserForm.helpers({
  completeUserList () {
    const completeUserList = JSON.parse(localStorage.getItem('completeUserList'));
    return completeUserList;
  },
});
