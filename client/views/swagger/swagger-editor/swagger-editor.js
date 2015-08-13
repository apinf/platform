Template.editor.helpers({
  // Creates a variable from the
  editorUrl: function () {
    var editorUrl = Meteor.settings.public.editorCongfiguration.host;
    return editorUrl;
  }
});
