import { Template } from 'meteor/templating';
import Posts from '../../collection';

Template.postsForm.helpers({
  postsCollection () {
    return Posts;
  },
  updateInsert () {
    const instance = Template.instance();
    if (instance.data.postItem) {
      return 'update';
    }
    return 'insert';
  },
});
