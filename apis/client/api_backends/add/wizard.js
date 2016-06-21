Template.addApiBackendWizard.onCreated(function(){
  Wizard.useRouter('iron:router');
});

Template.addApiBackendWizard.helpers({
  "steps": function () {
    var baseInformation = new SimpleSchema({
      name: {
        type: String,
        optional: false
      }
    });

    // Attach translation strings to base information schema
    baseInformation.i18n("schemas.apiWizard_baseInformation");

    var backendInformation = new SimpleSchema({
      backend_protocol: {
        type: String,
        optional: false,
        allowedValues: [
          'http',
          'https'
        ]
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

    // Attach translation strings to backend information schema
    backendInformation.i18n("schemas.apiWizard_backendInformation");

    var prefixesInformation = new SimpleSchema({
      url_matches: {
        type: Object,
        optional: true
      },
      "url_matches.frontend_prefix": {
        optional: true,
        type: String,
        regEx: SimpleSchema.RegEx.Prefix
      },
      "url_matches.backend_prefix": {
        optional: true,
        type: String,
        regEx: SimpleSchema.RegEx.Prefix
      }
    });

    // Attach translation strings to backend information schema
    prefixesInformation.i18n("schemas.apiWizard_prefixesInformation");

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

        // Url matches object must be in an array
        apiBackend.url_matches = [apiBackend.url_matches];

        // Add the least connections balance algorithm setting
        apiBackend.balance_algorithm = "least_conn";

        // Delete unneeded properties: database insert/update related
        delete apiBackend.insertDoc;
        delete apiBackend.updateDoc;
        delete apiBackend.backend_port;

        Meteor.call("getApiUmbrellaHostName", function (error, apiUmbrellaHost) {
          // Set frontend host to API Umbrella host value
          apiBackend.frontend_host = apiUmbrellaHost;

          // Create the API Backend on API Umbrella
          Meteor.call('createApiBackendOnApiUmbrella', apiBackend, function(error, apiUmbrellaWebResponse) {
            if (apiUmbrellaWebResponse.http_status === 200) {
              // Get API Backend from API Umbrella response
              var apiBackend = apiUmbrellaWebResponse.result.data.api;

              // Insert the API Backend
              var apiBackendId = ApiBackends.insert(apiBackend);

              // Get the ID of the newly created API Backend
              var apiUmbrellaApiId = apiBackend.id;

              // Tell Wizard the submission is complete
              context.done();

              //Redirect to the just created API Backend page
              Router.go('viewApiBackend', {_id: apiBackendId});

              // Publish the API Backend on API Umbrella
              Meteor.call('publishApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

                if (apiUmbrellaWebResponse.http_status === 201) {
                  sAlert.success("API Backend successfully published.");
                  // Add user to manager Role
                  Roles.addUsersToRoles(Meteor.userId(), ['manager']);
                } else {
                  var errors = _.values(apiUmbrellaWebResponse.errors);

                  // Flatten all error descriptions to show using sAlert
                  errors = _.flatten(errors);
                  _.each(errors, function(error) {
                    // Display error to the user, keep the sAlert box visible.
                    sAlert.error(error, {timeout: 'none'});
                  });
                }
              });
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

        });
      }
    }];

    return steps;
  }
});
