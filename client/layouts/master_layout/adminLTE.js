Template.AdminLTE.helpers({
  skin: function () {
    // Get color theme from branding collection
    var adminLTESkin = Branding.findOne().color_theme;
    // Set chosen AdminLTE skin or use default
    return adminLTESkin || 'blue-light';
  }
});
