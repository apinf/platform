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
        // Keep the context to use inside the callback function
        var context = this;

        // Get API Backend details from form steps
        var apiBackend = _.extend(wizard.mergedData(), data);

        // Restructure object to match API Umbrella API requirements
        apiBackend.servers = [{
          host: apiBackend.backend_host,
          port: apiBackend.backend_port
        }];

        apiBackend.url_matches = [apiBackend.url_matches];

        apiBackend.balance_algorithm = "least_conn";

        // Delete unneeded properties: insert/update related
        delete apiBackend.insertDoc;
        delete apiBackend.updateDoc;
        delete apiBackend.backend_port;

        Meteor.call('createApiBackendOnApiUmbrella', apiBackend, function(error, apiUmbrellaWebResponse) {
          if (apiUmbrellaWebResponse.http_status === 200) {
            // Insert the API Backend
            ApiBackends.insert(apiBackend);

            // Submit form on meteor:api-umbrella success
            context.done();
          } else {
            var errors = _.values(apiUmbrellaWebResponse.errors);

            // Flatten all error descriptions to show using sAlert
            errors = _.flatten(errors);
            _.each(errors, function(error) {
              //Display error to the user, keep the sAlert box visible.
              sAlert.error(error, {timeout: 'none'});
            });

            //Cancel form submission on error, so user see the sAlert.error message and edit the incorrect fields
            context.result(false);
          }
        });
      }
    }];

    return steps;
  }
});
