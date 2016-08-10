import { ApiBackends } from '/apis/collection/backend';

Template.visibilitySwitch.onRendered(function () {
  // Get reference to current template instance
  const instance = this;
  // Get API Backend from data context
  const apiBackend = this.data.apiBackend;

  // Get ID of current service
  const apiBackendId = apiBackend._id;

  // Get service visibility for toggle switch state
  const state = apiBackend.isPublic;

  // Get i18n strings for button labels
  const labelText = TAPi18n.__("visibilitySwitch_labelText");
  const offText = TAPi18n.__("visibilitySwitch_offText");
  const onText = TAPi18n.__("visibilitySwitch_onText");
  // Custom colors
  const onColor = 'primary';
  const offColor = 'default';

  // Create service visibility toggle switch
  $("[name='visibility']").bootstrapSwitch({
    labelText,
    offText,
    onText,
    onColor,
    offColor,
    state,
    onSwitchChange (event, isPublic) {
      // Set visibility of current API
      ApiBackends.update(apiBackendId, {$set: {isPublic}});
    }
  });
});
