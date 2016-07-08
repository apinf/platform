Template.apiBackendSelectPicker.onRendered(function () {

  const selectPickerElement = $('#api-frontend-prefix');

  // Initialize select picker widget
  selectPickerElement.selectpicker({});

});

Template.apiBackendSelectPicker.helpers({
  myApis () {

    const instance = Template.instance();

    const apis = instance.data.apis;

    const myApis = _.filter(apis, (api) => {
      return api.currentUserIsManager();
    });

    if (myApis.length > 0) {
      return myApis;
    }
  },
  otherApis () {

    const instance = Template.instance();

    const apis = instance.data.apis;

    return _.filter(apis, (api) => {
      return !api.currentUserIsManager();
    });
  }
});
