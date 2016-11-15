// In multi-proxy case: change early selected and saved proxy to current selected
import { TAPi18n } from 'meteor/tap:i18n';

export default function changeSelectedProxy (event, templateInstance, selectedItem) {
  // User changed to existing proxy
  // Notify users about changing proxy
  const message = TAPi18n.__('proxyBackend_confirmText_changeSelectedProxy');
  const confirmation = confirm(message);
  // Check if user clicked "OK"
  if (confirmation === true) {
    // Update to proxy id
    templateInstance.data.proxyId.set(selectedItem);
  } else {
    // Don't let to change item in dropdown list. Get the previous value
    event.currentTarget.options.selectedIndex = templateInstance.previousItemNumber;
  }
}