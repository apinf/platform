AutoForm.hooks({
  feedbackForm: {
    before: {
      insert (feedback) {
        feedback.apiBackendId = Router.current().params._id;

        return feedback;
      },
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('feedbackForm_successMessage');

      // Alert user of success
      sAlert.success(message);

      Modal.hide('feedbackForm');
    },
  },
});
