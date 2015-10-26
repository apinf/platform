Meteor.publish('feedback', function(){
  // If user is admin - show all feedback
  if (Roles.userIsInRole(this.userId, ['admin'])){
    return Feedback.find({});
  } else {
    // else - show all user's feedback
    return Feedback.find({author: this.userId});
  }
});
