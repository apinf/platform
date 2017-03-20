/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import Posts from './';

Posts.allow({
  insert (userId, post) {
    return post.userCanEditPost();
  },
  remove (userId, post) {
    return post.userCanEditPost();
  },
  update (userId, post) {
    return post.userCanEditPost();
  },
});
