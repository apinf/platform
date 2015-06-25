//code shared between client and server

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);


// Creates table with the fields name, author, ur
TabularTables.ApiTable = new Tabular.Table({
  name: "ApiTable",
  collection: ApiBackends,
  columns: [
    {data: "name", title: "Name"},
    {data: "host", title: "Backend host"}
  ]
});
