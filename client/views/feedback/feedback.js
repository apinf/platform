Template.feedbackList.created = function () {
  // Subscription to feedback collection
  var currentRouter = Router.current().params._id;
  this.subscribe('apiBackendFeedback', currentRouter);
};

Template.feedbackItem.created = function () {
  // Subscription to feedback collection
  this.subscribe('feedback');
};

Template.feedbackList.helpers({
  'userFeedback' : function() {
    return Feedback.find();
  },
  'haveFeedback' : function() {
    // Count user's feedback in feedback collection
    var feedbackCount  = Feedback.find().count();
    return feedbackCount > 0;
  }
});

Template.feedbackList.events({
  // Delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  }
});

AutoForm.hooks({
  feedback: {
    before: {
      insert: function (feedback) {
        feedback.apiBackendId = Router.current().params._id;
        return feedback;
      }
    },
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    }
  }
});

AutoForm.addHooks(['feedback'], {
  // Success message
  onSuccess: function () {
    FlashMessages.sendSuccess('Thank you! Your feedback has been successfully sent.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
