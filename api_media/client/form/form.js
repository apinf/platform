import { Template } from 'meteor/templating';
import Posts from '../../collection';

Template.apiMediaPostsForm.helpers({
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
