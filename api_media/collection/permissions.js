import Posts from './';

Posts.allow({
  insert (userId, post) {
    const postApiId = post.apiId;
    return post.postsAllow(postApiId);
  },
  remove (userId, post) {
    const postApiId = post.apiId;
    return post.postsAllow(postApiId);
  },
  update (userId, post) {
    const postApiId = post.apiId;
    return post.postsAllow(postApiId);
  },
});
