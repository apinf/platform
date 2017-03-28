/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Posts from '/related_media/collection';

Template.deletePostConfirmation.events({
  'click #modal-delete-post': function (event, templateInstance) {
    // Get Post ID
    const postId = templateInstance.data.post._id;
    // Remove post according to post Id
    Posts.remove(postId);
    Modal.hide('deletePostConfirmation');
  },
});
