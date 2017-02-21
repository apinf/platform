import { Template } from 'meteor/templating';
import Posts from '../../collection';

Template.apiMediaPostsForm.helpers({
  postsCollection () {
    // passes posts to form.html
    return Posts;
  },
  updateInsert () {
    const instance = Template.instance();
    if (instance.data.postItem) {
      // Pass update if the postItem template is active
      return 'update';
    }
    // Otherwise pass insert
    return 'insert';
  },
});
