/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.tenantUserForm.events({
  'click #addUserToTenant': function () {
    if ($('#completeUserList')[0].selectedIndex < 0) {
      // User not selected, get error message translation
      const errorMmessage = TAPi18n.__('tenantUserForm_errorTextUserNotSelected');
      // Alert user of error
      sAlert.error(errorMmessage, { timeout: 'none' });
    } else {
      // get the selected user's email address from complete user list
      const userId = $('#completeUserList option:selected').val();
      const completeUserList = Session.get('completeUserList');
      const thisUser = completeUserList.filter((userdata) => {
        if (userdata.id === userId) {
          return {
            userdata,
          }
        }
        return false;
      });

      const newUser = {
        id: $('#completeUserList option:selected').val(),
        name: $('#completeUserList option:selected').text(),
        provider: false,
        consumer: false,
        email: thisUser[0].email,
      };

      let tenantUsers = [];
      // Get possible previous users of tenant
      if (Session.get('tenantUsers')) {
        tenantUsers = Session.get('tenantUsers');
      }

      // Check if the new user already is a user of Tenant
      const userAlreadyInArray = tenantUsers.find((user) => {
        return user.name === newUser.name;
      });

      // Add to user list unless already included in
      if (userAlreadyInArray) {
        // Duplicate user, get error message translation
        let errorMmessage = TAPi18n.__('tenantUserForm_errorTextDuplicateUser');
        errorMmessage = errorMmessage.concat(newUser.name);
        // Alert user of error
        sAlert.error(errorMmessage, { timeout: 'none' });
      } else {
        // Add new user object to array
        tenantUsers.push(newUser);

        console.log('new userlist on tenant=', tenantUsers);
        // Save to localStorage to be used while listing users of tenant
        Session.set('tenantUsers', tenantUsers);

        // unselect username
        $('#completeUserList option:selected').prop('selected', false);
        // Disable add button, when no user is selected
        // $('#addUserToTenant').prop('disabled', true);
      }
    }
  },
});

Template.tenantUserForm.helpers({
  completeUserList () {
 //   const completeUserList = JSON.parse(Session.get('completeUserList'));
    const completeUserList = Session.get('completeUserList');
    return completeUserList;
  },
});
