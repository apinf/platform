Template.feedbackList.created = function () {
  this.subscribe('feedback');
};

Template.feedbackPage.created = function () {
  this.subscribe('feedback');
};

Template.feedbackList.helpers({
  'userFeedbacks' : function() {
    return Feedback.find();
  }
});

Template.feedbackList.events({
  // delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  }
});

AutoForm.hooks({
  feedback: {
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
  onSuccess: function () {
    FlashMessages.sendSuccess('Thank you! Your feedback has been successfully sent.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
