/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.footer.onCreated(function () {
  this.autorun(() => {
    // Get branding document
    const branding = Template.currentData().branding;

    // Make sure footer code exists
    if (branding && branding.footerCode) {
      //
      FlowRouter.watchPathChange();
      // Get previously and current route
      const oldRoute = FlowRouter.current().oldRoute;
      const currentRoute = FlowRouter.current().route;

      // Make sure route was changed
      if (oldRoute && oldRoute.pathDef !== currentRoute.pathDef) {
        // Run analytic script
        // eslint-disable-next-line
        eval(branding.footerCode);
      }
    }
  });
});

Template.footer.events({
  'click #about-button': function () {
    // Show the 'about Apinf' modal
    Modal.show('aboutApinf');
  },
});
