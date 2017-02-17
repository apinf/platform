import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/settings', {
  name: 'settings',
  action () {
    BlazeLayout.render('masterLayout', { main: 'settings' });
  },
});
