/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import '/apinf_packages/backlog/client/backlog.html';
import '/apinf_packages/backlog/client/list/list.html';

Template.apiBacklog.events({
  'click #add-backlog-item': function () {
    // Show Add API Backlog Item modal
    Modal.show('apiBacklogItemForm', { formType: 'insert' });
  },
});
