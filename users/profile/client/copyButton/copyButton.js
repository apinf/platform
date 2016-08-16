import Clipboard from "clipboard";

Template.profileApiKeyCopyButton.onRendered(function () {
  // Initialize Clipboard copy button
  let copyButton = new Clipboard("#copyApiKey");

  // Tell the user when copy is successful
  copyButton.on("success", function () {
    // Get localized success message
    const successMessage = TAPi18n.__("profile_apiKey_copySuccessful");

    // Display success message to user
    sAlert.success(successMessage);
  })
});
