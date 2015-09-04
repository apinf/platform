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
    {tmpl: Meteor.isClient && Template.favourite, title: "Bookmark"}
  ]
});
