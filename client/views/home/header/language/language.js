Template.languageBar.helpers({
  languages: function() {
    /*
    This helper converts the languages object into an array of objects
    TODO: determine if there is a simpler way to perform these steps
    */

    // Placeholder for language options
    let languageOptions = [];

    // Get all site translation languages
    const languages = TAPi18n.getLanguages();

    // Create Array of Objects with language tag and name
    for (language in languages) {
      // Get language object
      let languageOption = languages[language];

      // Get language tag (short language name)
      languageOption.tag = language;

      // Add language option to array
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
