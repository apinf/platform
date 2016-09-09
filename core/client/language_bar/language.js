Template.languageBar.helpers({
  languages () {
    /*
    This helper converts the languages object into an array of objects
    TODO: determine if there is a simpler way to perform these steps
    */

    // Placeholder for language options
    const languageOptions = [];

    // Get all site translation languages
    const languages = TAPi18n.getLanguages();

    // Create Array of Objects with language tag and name
    for (language in languages) {
      // Get language object
      const languageOption = languages[language];

      // Get language tag (short language name)
      languageOption.tag = language;

      // Add language option to array
      languageOptions.push(languageOption);
    }

    return languageOptions;
  },
  activeLanguage () {
    // Get current language
    const activeLanguage = TAPi18n.getLanguage();

    // Get language from the current data context
    const languageTag = this.tag;

    // Add class "active" to highlight active language
    if (activeLanguage === languageTag) {
      return 'active';
    }
  },
});

Template.languageBar.events({
  'click .language-option': function (event, template) {
    // Get language from the current data context
    const language = this.tag;

    // Update site language with selected language
    TAPi18n.setLanguage(language);
  },
});
