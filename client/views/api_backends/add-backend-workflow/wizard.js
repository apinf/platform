Template.addApiBackendWizard.helpers({
  "steps": function () {
    var baseInformation = new SimpleSchema({
      "name": {
        type: String,
        optional: false
      },
      "frontend_prefix": {
        label: 'Frontend prefix',
        optional: false,
        type: String,
        regEx: SimpleSchema.RegEx.Prefix
      }
    });

    var serverInformation = new SimpleSchema({
      "host": {
        type: String,
        label: "Hostname",
        optional: false
      },
      "port": {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Port
      }
    });

    var steps = [{
      id: 'base-information',
      title: 'Base Information',
      schema: baseInformation
    }, {
      id: 'server-information',
      title: 'Servers',
      schema: serverInformation
    }];

    return steps;
  }
});
