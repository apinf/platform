import { Posts } from '../../collection';
import moment from 'moment';

Template.postsForm.helpers({
  postsCollection () {
    return Posts;
  },
  updateInsert () {
    const instance = Template.instance();
    if (instance.data.postItem) {
      return "update";
    }
    else {
      return "insert";
    }
  }
});
