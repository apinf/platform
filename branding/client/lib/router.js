import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/settings/branding', {
  name: 'branding',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'branding' });
  },
});
