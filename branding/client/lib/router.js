// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/settings/branding', {
  name: 'branding',
  action () {
    BlazeLayout.render('masterLayout', { main: 'branding' });
  },
});
