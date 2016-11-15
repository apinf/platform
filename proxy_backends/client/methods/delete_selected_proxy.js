// In multi-proxy case: change early selected and saved proxy to first position in dropdown list 'Select proxy'

export default function deleteSelectedProxy (event, templateInstance) {
  // Notify users about deleting proxy
  const confirmation = confirm('Do you want to switch off proxy? ' +
    'All information will be deleted and API link will be broken!');
  // Check if user clicked "OK"
  if (confirmation === true) {
    // Update proxy id
    templateInstance.data.proxyId.set('');
  } else {
    // Don't let to change item in dropdown list. Get the previous value
    event.currentTarget.options.selectedIndex = templateInstance.previousItemNumber;
  }
}