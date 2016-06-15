//code shared between client and server

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

// Creates table with the fields name, author, ur
TabularTables.ApiTable = new Tabular.Table({
  name: "ApiTable",
  collection: ApiBackends,
  columns: [
    {data: "name", title: "Name"},
    {data: "backend_host", title: "Backend host"},
    {
      title: "View Details",
      tmpl: Meteor.isClient && Template.viewApiBackendButton
    },
    {tmpl: Meteor.isClient && Template.favourite, title: "Bookmark"},
    {
      data: "averageRating",
      tmpl: Meteor.isClient && Template.apiBackendRating,
      title: "Rating"
    },
    {data: "bookmarkCount", title: "Popularity"},
  ],
  responsive: true,
  autoWidth: false
});
