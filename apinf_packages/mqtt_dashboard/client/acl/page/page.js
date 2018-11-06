/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.aclPage.onCreated(function () {
  this.formType = 'insert';

  this.formEdited = new ReactiveVar();
  this.dataIsReady = new ReactiveVar();
  this.error = new ReactiveVar();

  this.aclRules = new ReactiveVar();
  this.aclRule = new ReactiveVar();

  this.getAclRules = () => {
    // Set flag is fetching
    this.dataIsReady.set(false);

    // Send request to Postgres to get data
    Meteor.call('getAclRules', (error, result) => {
      // Set flag is Ready
      this.dataIsReady.set(true);

      if (error) {
        this.error.set(true);
        this.errorText = error.message;
        // Display Error message
        throw new Meteor.Error(error.message);
      } else {
        // Update data
        this.aclRules.set(result.data);
      }
    });
  };

  this.getAclRules();
});

Template.aclPage.onRendered(() => {
  $('.dropdown-toggle').dropdown();
});

Template.aclPage.helpers({
  aclRules () {
    return Template.instance().aclRules.get();
  },
  dataIsReady () {
    return Template.instance().dataIsReady.get();
  },
  error () {
    return Template.instance().error.get();
  },
  errorText () {
    return Template.instance().errorText.get();
  },
  formEdited () {
    return Template.instance().formEdited.get();
  },
  selectedAclRule () {
    return Template.instance().aclRule.get();
  },
  allowValue (value) {
    return value === 1 ? 'Allow' : 'Deny';
  },
  accessValue (value) {
    let access = value;

    switch (value) {
      case 1: {
        access = 'Subscribe';
        break;
      }
      case 2: {
        access = 'Publish';
        break;
      }
      case 3: {
        access = 'Both';
        break;
      }
      default:
        break;
    }

    return access;
  },
});

Template.aclPage.events({
  'submit form': (event, templateInstance) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Create a data to body param
    const requestData = {
      allow: parseInt(formData.get('allow'), 10),
      access: parseInt(formData.get('access'), 10),
      topic: formData.get('topic'),
      username: formData.get('username'),
      ipaddr: formData.get('ipaddr'),
      clientid: formData.get('clientid'),
    };

    if (templateInstance.formType === 'insert') {
      // Send request to Add
      Meteor.call('addAclRule', requestData, (error) => {
        if (error) {
          sAlert.error(error);
        } else {
          templateInstance.formEdited.set(false);
          templateInstance.getAclRules();
        }
      });
    } else {
      // Send request to Update (Edit)
      Meteor.call('editAclRule', templateInstance.aclRuleId, requestData, (error) => {
        if (error) {
          sAlert.error(error.message);
        } else {
          templateInstance.formEdited.set(false);
          templateInstance.getAclRules();
        }
      });
    }
  },
  'click #add-acl': (event, templateInstance) => {
    // Display Edit form
    templateInstance.formEdited.set(true);
    templateInstance.formType = 'insert';

    templateInstance.aclRule.set();
    templateInstance.aclRuleId = '';
  },
  'click .acl-edit': (event, templateInstance) => {
    // Display Edit form
    templateInstance.formEdited.set(true);
    templateInstance.formType = 'update';

    const index = event.currentTarget.dataset.index;
    const rule = templateInstance.aclRules.get()[index];

    templateInstance.aclRule.set(rule);
    templateInstance.aclRuleId = rule.id;
  },
  'click .acl-delete': (event, templateInstance) => {
    const aclRuleId = event.currentTarget.dataset.id;
    // Send request to remove from remote Database
    Meteor.call('deleteAclRule', aclRuleId, (error) => {
      if (error) {
        sAlert.error(error);
      } else {
        templateInstance.getAclRules();
      }
    });
  },
  'click .cancel': (event, templateInstance) => {
    // Hide Edit form
    templateInstance.formEdited.set(false);
  },
});
