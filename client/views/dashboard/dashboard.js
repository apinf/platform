Template.sidebar.rendered = function() {

  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible
  $('.collapsible').collapsible();

  // Show sideNav
  $('.button-collapse').sideNav('show');
  // Hide sideNav
  $('.button-collapse').sideNav('hide');
}
