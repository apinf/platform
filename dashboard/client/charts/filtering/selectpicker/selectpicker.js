Template.apiBackendSelectPicker.onRendered(function () {

  const selectPickerElement = $('#api-frontend-prefix');

  // Initialize select picker widget
  selectPickerElement.selectpicker({});

});

Template.apiBackendSelectPicker.helpers({
  myApis () {

    // Get reference to template instance
    const instance = Template.instance();

    // Get apis from template context
    const apis = instance.data.apis;

    // Get apis that user manages
    const myApis = _.filter(apis, (api) => {
      return api.currentUserIsManager();
    });

    // Check if there are any apis that user manages
    if (myApis.length > 0) {
      return myApis;
    }
  },
  otherApis () {

    // Get reference to template instance
    const instance = Template.instance();

    // Get apis from template context
    const apis = instance.data.apis;

    // Get apis that user doesn't manage
    return _.filter(apis, (api) => {
      return !api.currentUserIsManager();
    });
  }
});
