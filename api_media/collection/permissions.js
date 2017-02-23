import Posts from './';

Posts.allow({
  insert (userId, post) {
    return post.isPostActionAllow();
  },
  remove (userId, post) {
    return post.isPostActionAllow();
  },
  update (userId, post) {
    return post.isPostActionAllow();
  },
});
