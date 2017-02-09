import { Posts } from '../../collection';

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

// Display creation datestamp as a tooltip
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
});

// Calculate time passed from create
Template.registerHelper('calculateFromDate', function(date) {
  // return moment(date).format('YYYY-MM-DD HH:mm');
  return moment(date).from(moment());
});

// Close modal after successful insert/update
AutoForm.addHooks("postsForm",{
  onSuccess: function(){
    Modal.hide("postInsertModal");
  }
})
