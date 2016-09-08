AutoForm.hooks({
  feedbackForm: {
    before: {
      insert (feedback) {
        feedback.apiBackendId = Router.current().params._id;

        return feedback;
      },
    },
    onSuccess () {
      sAlert.success('Thank you! Your feedback has been successfully sent.');
    },
  },
});
