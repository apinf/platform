// In multi-proxy case:
// Change early selected and saved proxy to first position in dropdown list 'Select proxy'
import { TAPi18n } from 'meteor/tap:i18n';

export default function deleteSelectedProxy (event, templateInstance) {
  // Notify users about deleting proxy
  const message = TAPi18n.__('proxyBackend_confirmText_deleteSelectedProxy');
  const confirmation = confirm(message);
  // Check if user clicked "OK"
  if (confirmation === true) {
    // Update proxy id
    templateInstance.data.proxyId.set('');
  } else {
    // Don't let to change item in dropdown list. Get the previous value
    event.currentTarget.options.selectedIndex = templateInstance.previousItemNumber;
  }
}