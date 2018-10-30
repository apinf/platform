/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Template } from 'meteor/templating';

Template.addForm.onRendered(() => {
  const aclRule = Template.currentData().aclRule;

  if (aclRule) {
    // Set values for Dropdown list
    this.$('#allow-options').val(aclRule.allow);
    this.$('#access-options').val(aclRule.access);
  }
});

Template.addForm.helpers({
  aclRule () {
    return Template.currentData().aclRule || {};
  },
});
