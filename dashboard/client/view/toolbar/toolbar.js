/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.dashboardToolbar.helpers({
  selectedOption () {
    const proxyId = FlowRouter.getQueryParam('proxy');

    // Select this option if it is equal with query param value
    return proxyId === this._id ? 'selected' : '';
  },
});
