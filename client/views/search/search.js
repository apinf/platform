Template.search.created = function () {

  // Get reference to Template
  var instance = this;

  // Init reactive var for search value
  instance.searchValue = new ReactiveVar();

  // Init reactive parameter for search parameter & assign query parameter if one is provided
  instance.searchParameter = new ReactiveVar(Router.current().params.query.q);

};

Template.search.rendered = function () {

  // Get reference to Template
  var instance = this;

  // Check if search parameter is set
  if (instance.searchParameter.get()) {

    // Update search field with search value provided in the URL
    $('#search-text').val(instance.searchParameter.get());

  }
  
  $('#search-text').focus();

};

Template.search.helpers({
  searchResults: function() {

    // Get reference to Template
    var instance = Template.instance();

    // Check if query was provided in the URL (e.g. "/search?q=search_param")
    if (instance.searchParameter.get()) {

      // Get query parameter & assign it to searchValue
      var searchValue = instance.searchParameter.get();

    } else {

      // Get searchValue & assign in to searchValue
      var searchValue = instance.searchValue.get();

    }

    // Subscribe to a "search" publication
    Meteor.subscribe("searchApiBackends", searchValue);

    // Fetch ApiBackend documents
    var searchResults = ApiBackends.find().fetch();

    return searchResults;

  }
});

Template.search.events({
  "keyup #search-text": function (event, template) {

    // Get reference to Template
    var instance = Template.instance();

    event.preventDefault();

    // Clean searchParameter
    instance.searchParameter.set(undefined);

    // Get search text from a text field.
    var searchValue = $('#search-text').val();

    // Set searchValue to a reactive variable
    instance.searchValue.set(searchValue);
  }
});
