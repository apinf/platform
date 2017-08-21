/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';
import Posts from '../../collection';

Template.relatedMediaPostsForm.helpers({
  postsCollection () {
    // passes posts to form.html
    return Posts;
  },
  formType () {
    const instance = Template.instance();
    if (instance.data.post) {
      // Pass update if the postItem template is active
      return 'update';
    }
    // Otherwise pass insert
    return 'insert';
  },
});
