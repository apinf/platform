/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Close modal after successful insert/update
AutoForm.addHooks('relatedMediaPostsForm', {
  onSuccess () {
    Modal.hide('relatedMediaPostsForm');
    // Quick and dirty solution, to be fixed later
    // Because after updating URL, the oembed does not refresh
    // Using flow-router, a refresh is called
    const context = FlowRouter.current();
    FlowRouter.go('/');
    FlowRouter.go(context.path);
  },
});
