Template.languageBar.helpers({
  languages: function() {
    // Create Array of Objects with language tag and name
    const languages = TAPi18n.getLanguages();
    let languageOptions = [];
    for (language in languages) {
      let languageOption = languages[language];
      languageOption.tag = language;
      languageOptions.push(languageOption);
    }
    return languageOptions;
  }
});

Template.languageBar.events({
  "click .language-option": function(event, template) {
    // Get language from the current data context
    let language = this.tag;
    TAPi18n.setLanguage(language);
  }
});
