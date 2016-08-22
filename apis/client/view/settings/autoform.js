AutoForm.hooks({
  "aboutApiForm": {
    before: {
      update (api) {
        // Set updated by
        api.$set.updated_at = new Date();
        api.$set.updated_by = Meteor.userId();

        this.result(api);
      }
    },
    onSuccess (formType, apiId) {
      // Alert the user of the success
      sAlert.success("API successfully edited.");
    }
  }
});
