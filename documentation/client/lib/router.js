import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/documentation/editor', {
  name: 'apiDocumentationEditor',
  action () {
    BlazeLayout.render('masterLayout', { main: 'apiDocumentationEditor' });
  },
});
