import _ from 'lodash'

Template.apiSelectPicker.onRendered(function () {

  const instance = this;

  instance.selectPickerElement = $('#api-frontend-prefix');

  // Initialize select picker widget
  instance.selectPickerElement.selectpicker({});

});
