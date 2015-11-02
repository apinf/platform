AutoForm.hooks({
  updateProfile: {
    onSuccess: function(operation, result, template) {
      return sAlert.success('Profile updated');
    },
    onError: function(operation, error, template) {
      return sAlert.error(error);
    }
  }
});

Template.profile.rendered = function () {

  // initializes button
  var copyButton = $("<a class=\"btn btn-default btn-xs\" id=\"copyApi\"> Copy API to clipboard</a>");

  // get input field that holds api key
  var apiKeyField = $("input[name='profile.apiKey']");

  // gets id attribute value from input field
  var apiKeyFieldId = apiKeyField.attr('id');

  // attaches new attribute with input field id to a button,
  // data-clipboard-target attr is required for clipboard.js to work
  copyButton.attr("data-clipboard-target", "#" + apiKeyFieldId);

  // appends the actual button object next to input field
  apiKeyField.next().append(copyButton);

  // initializes copy-to-clipboard functionality
  new Clipboard("#copyApi");

  // adds listener to button and notifies user if text is copied
  copyButton.on("click", function () {
    copyButton.text("Copied!");
  });

};
