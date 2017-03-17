/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import 'moment/min/locales.min';

Template.backlogItem.helpers({
  relativeTimeStamp (givenTimeStamp) {
    // Get current language
    const language = TAPi18n.getLanguage();
    // Return relative time from now
    return moment(givenTimeStamp).locale(language).fromNow();
  },
  itemPriorityClass (priority) {
    // Init priorityClass
    let priorityClass = '';
    // Check priority value & return specific CSS class for label to display
    switch (priority) {
      case 2:
        priorityClass = 'priority priority-high';
        break;
      case 1:
        priorityClass = 'priority priority-middle';
        break;
      case 0:
        priorityClass = 'priority priority-low';
        break;
      default:
        break; // do nothing
    }
    return priorityClass;
  },
  currentUserIsOwner (backlogItem) {
    // Get current User ID
    const currentUser = Meteor.userId();

    // Check if current User ID matches backlog User ID
    return currentUser === backlogItem.userId;
  },
});

Template.backlogItem.events({
  'click .edit-backlog-item': function () {
    // Show apiBacklogItemForm modal
    Modal.show('apiBacklogItemForm', { formType: 'update', backlogItem: this.item });
  },
  'click .delete-backlog-item': function () {
    // Show the Delete Confirmation dialogue
    Modal.show('deleteBacklogItem', { backlogItem: this.item });
  },
});
