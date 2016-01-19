Template.AdminLTE.helpers({
  skin: function () {
    // Placeholder for admin LTE screen
    var adminLTESkin;

    // Get branding if it exists
    var branding = Branding.findOne();

    // Check if branding and color theme exists
    if (branding && branding.color_theme) {
      // Get color theme from branding collection
      adminLTESkin = branding.color_theme;

      return adminLTESkin;
    } else {
      // Return a default theme
      return 'blue-light';
    }
  }
});
