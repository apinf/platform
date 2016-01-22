Template.languageBar.helpers({
  languages: function() {
    const languages = TAPi18n.getLanguages();
    let languageOptions = [];
    for (language in languages) {
      let languageOption = languages[language];
      languageOption.tag = language;
      languageOptions.push(languageOption);
    }
    console.log(languageOptions);
    return languageOptions;
  }
});

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
