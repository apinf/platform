import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/search', {
  name: 'search',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'search' });
  },
});
