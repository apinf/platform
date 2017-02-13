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

// Calculate time passed from create
Template.registerHelper('calculateFromDate', function(date) {
  // return moment(date).format('YYYY-MM-DD HH:mm');
  return moment(date).from(moment());
});
