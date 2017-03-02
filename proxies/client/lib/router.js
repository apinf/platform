// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/settings/proxies', {
  name: 'proxies',
  action () {
    BlazeLayout.render('masterLayout', { main: 'proxies' });
  },
});
