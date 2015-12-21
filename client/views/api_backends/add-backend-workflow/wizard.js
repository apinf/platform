Template.addApiBackendWizard.helpers({
  "steps": function () {
    var baseInformation = new SimpleSchema({
      name: {
        type: String,
        optional: false
      }
    });

    var backendInformation = new SimpleSchema({
      backend_protocol: {
        type: String,
        optional: false,
        allowedValues: [
          'http',
          'https'
        ],
        label: 'Backend protocol'
      },
      backend_host: {
        type: String
      },
      backend_port: {
        type: Number,
        optional: true,
        regEx: SimpleSchema.RegEx.Port,
        autoform: {
          defaultValue: 80
        }
      }
    });

    var frontendInformation = new SimpleSchema({
      frontend_host: {
        type: String,
        optional: false
      }
    });

    var prefixesInformation = new SimpleSchema({
      url_matches: {
        type: Object,
        optional: true
      },
      "url_matches.frontend_prefix": {
        label: 'Frontend prefix',
        optional: true,
        type: String,
        regEx: SimpleSchema.RegEx.Prefix
      },
      "url_matches.backend_prefix": {
        label: 'Backend prefix',
        optional: true,
        type: String,
        regEx: SimpleSchema.RegEx.Prefix
      }
    });

    var steps = [{
      id: 'base-information',
      title: 'Base Information',
      template: 'baseInformation',
      formId: 'base-information-form',
      schema: baseInformation
    }, {
      id: 'backend-information',
      title: 'Backend',
      template: 'backendInformation',
      formId: 'backend-information-form',
      schema: backendInformation
    }, {
      id: 'frontend-information',
      title: 'Frontend',
      template: 'frontendInformation',
      formId: 'frontend-information-form',
      schema: frontendInformation
    }, {
      id: 'prefixes-information',
      title: 'Matching URL Prefixes',
      template: 'prefixesInformation',
      formId: 'prefixes-information-form',
      schema: prefixesInformation,
      onSubmit: function (data, wizard) {
        // Get API Backend details from form steps
        var apiBackend = _.extend(wizard.mergedData(), data);

        // Delete unneeded properties: insert/update related
        delete apiBackend.insertDoc;
        delete apiBackend.updateDoc;
      }
    }];

    return steps;
  }
});
