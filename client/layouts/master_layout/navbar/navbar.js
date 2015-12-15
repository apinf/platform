Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  }
});

Template.navbar.events({
  'submit #header-search': function (event, template) {

    event.preventDefault();

    var searchValue = $('#header-search-text').val();

    Router.go('search', {}, {query: 'q='+searchValue});

  }
});
