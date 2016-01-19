Template.AdminLTE.helpers({
  skin: function () {
    // Placeholder for admin LTE screen
    var adminLTESkin;

    // Get branding if it exists
    var branding = Branding.findOne();

    // Check if branding and color theme exists
    if (branding && branding.color_theme) {
      // If branding color theme exists, return it
      adminLTESkin = branding.color_theme;

      return adminLTESkin;
    } else {
      // Otherwise, return a default theme
      return 'blue-light';
    }
  }
});
