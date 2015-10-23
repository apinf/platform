Meteor.publish('feedback', function(){
  if (Roles.userIsInRole(this.userId, ['admin'])){
    return Feedback.find({});
  } else {
    return Feedback.find({author: this.userId});
  }
});
