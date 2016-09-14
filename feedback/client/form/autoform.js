AutoForm.hooks({
  feedbackForm: {
    before: {
      insert (feedback) {
        feedback.apiBackendId = Router.current().params._id;

        return feedback;
      },
    },
    onSuccess () {
      sAlert.success(TAPi18n.__('feedbackForm_successMessage'));
      Modal.hide('feedbackForm');
    },
  },
});
