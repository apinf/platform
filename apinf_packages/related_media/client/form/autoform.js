/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.addHooks('relatedMediaPostsForm', {
  onSuccess () {
    // Close modal after successful insert/update
    Modal.hide('relatedMediaPostsForm');

    // Refresh page to display fresh oembed data
    FlowRouter.reload();
  },
});
