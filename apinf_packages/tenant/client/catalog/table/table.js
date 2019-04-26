/* Copyright 2019 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.tenantCatalogTable.helpers({
  tenantOwner (tenantOwnerId) {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    // Only Tenant owner is able to modify and remove
    if (user && user.services && user.services.fiware && user.services.fiware.id) {
      return user.services.fiware.id === tenantOwnerId;
    }
    return false;
  },
});
