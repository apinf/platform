Template.languageBar.events({
  "click #en": function(event, template) {
    TAPi18n.setLanguage('en');
  },
  "click #sv": function(event, template) {
    TAPi18n.setLanguage('sv');
  },
  "click #fi": function(event, template) {
    TAPi18n.setLanguage('fi');
  }
});
