Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  "isSearchRoute": function () {
    // Get name of current route from Router
    var routeName = Router.current().route.getName();

    if (routeName === "search") {
      return true;
    } else {
      return false;
    }
  }
});

Template.navbar.onRendered(function() {
  $('.icon-search').click(function() {
    $('.searchblock-toggle').slideToggle("fast");
    $('.toggle-search-icon').toggle();
    $('#search-text').focus();
  });
});
