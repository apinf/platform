import Clipboard from "clipboard";

AutoForm.hooks({
  updateProfile: {
    onSuccess: function(operation, result, template) {
      return sAlert.success('Profile updated');
    },
    onError: function() {
      this.addStickyValidationError('username', 'usernameTaken');
    }
  }
});

Template.profile.rendered = function () {
  const instance = this;

  // Get logged in user
  const currentUser = Meteor.user();

  // Check logged in user exists
  if (currentUser) {
    // Ask user to set username if it is not set.
    if(!currentUser.username) {
      const setUsernameMsg = TAPi18n.__("profile-setUsername");
      sAlert.info(setUsernameMsg);
    }
    instance.autorun(function(){
      // Show clipboard button only if API key exists
      if(currentUser.profile.apiKey) {
        // initializes button
        var copyButton = $("<a class=\"btn btn-default btn-xs\" id=\"copyApi\"> Copy API key to clipboard</a>");

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
      }
    });
  }
};

Template.profile.events({
  'click .get-umbrellaApiKey'(event) {
    Meteor.call('createAPIkeyForCurrentUser', function(error, result) {
      if(error) {
        sAlert.error(error);
      }
    });
  }
});

Template.profile.helpers({
  currentUser () {
    return Meteor.user();
  }
});
