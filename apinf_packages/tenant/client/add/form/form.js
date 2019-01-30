/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.tenantUserForm.events({
  'click #addTenantUser': function (event, templateInstance) {
    console.log('lisätys', templateInstance);

    if ($('#userRoleConsumer').is(':disabled')) {
      sAlert.error("Incorrect selection", { timeout: 'none' });
    } else {
      console.log('con=', $('#userRoleConsumer:checked').val());
      console.log('pro=', $('#userRoleProvider:checked').val());
      console.log('name=', $('#completeUserList option:selected').text());
  
      const newUser = {
        username: $('#completeUserList option:selected').text(),
        provider: $('#userRoleProvider:checked').val() || false,
        consumer: $('#userRoleConsumer:checked').val() || false,
      };
  
      let tenantUsers = [];
      // Get possible previous users of tenant
      if (localStorage.getItem('tenantUsers')) {
        tenantUsers = JSON.parse(localStorage.getItem('tenantUsers'));  
      }
  
      // Add new user object to array
      tenantUsers.push(newUser);
  
      // Save to localStorage to be used while listing users of tenant
      localStorage.setItem('tenantUsers', JSON.stringify(tenantUsers));   
    }

  },
});

Template.tenantUserForm.helpers({
  completeUserList () {
    const completeUserList = JSON.parse(localStorage.getItem('completeUserList'));
    return completeUserList;
  },
});
