import Clipboard from 'clipboard';

Template.apiKeyCopyButton.onRendered(function () {
  // Initialize Clipboard copy button
  const copyButton = new Clipboard('#copyApiKey');

  // Tell the user when copy is successful
  copyButton.on('success', function (event) {
    // Get localized success message
    const message = TAPi18n.__('apiKeys_copySuccessful');

    // Display success message to user
    sAlert.success(message);

    // Show success message only once
    event.clearSelection();
  });
});
