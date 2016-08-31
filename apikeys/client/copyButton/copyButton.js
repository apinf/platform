import Clipboard from "clipboard";

Template.apiKeyCopyButton.onRendered(function () {
  // Initialize Clipboard copy button
  let copyButton = new Clipboard("#copyApiKey");

  // Tell the user when copy is successful
  copyButton.on("success", function () {
    // Get localized success message
    const successMessage = TAPi18n.__("apiKeys_copySuccessful");

    // Display success message to user
    sAlert.success(successMessage);
  })
});
