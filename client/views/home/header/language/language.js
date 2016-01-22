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
  },
  activeLanguage: function () {
    // Get current language
    const activeLanguage = TAPi18n.getLanguage();

    // Get language from the current data context
    let languageTag = this.tag;

    // Add class "active" to highlight active language
    if (activeLanguage === languageTag) {
      return "active";
    }
  }
});

Template.languageBar.events({
  "click .language-option": function(event, template) {
    // Get language from the current data context
    let language = this.tag;
    TAPi18n.setLanguage(language);
  }
});
