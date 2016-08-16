import { Apis } from '/apis/collection/collection';

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
      title: TAPi18n.__("addApiBackendWizard_steps_baseInformation_title"),
      template: 'baseInformation',
      formId: 'base-information-form',
      schema: baseInformation
    }, {
      id: 'backend-information',
      title: TAPi18n.__("addApiBackendWizard_steps_backendInformation_title"),
      template: 'backendInformation',
      formId: 'backend-information-form',
      schema: backendInformation
    }, {
      id: 'prefixes-information',
      title: TAPi18n.__("addApiBackendWizard_steps_prefixesInformation_title"),
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

        Meteor.call("getApiUmbrellaHostName", function (error, apiUmbrellaHost) {
          // Set frontend host to API Umbrella host value
          apiBackend.frontend_host = apiUmbrellaHost;

          // Create the API Backend on API Umbrella
          Meteor.call('createApiBackendOnApiUmbrella', apiBackend, function(error, apiUmbrellaWebResponse) {
            if (apiUmbrellaWebResponse.http_status === 200) {
              // Get API Backend from API Umbrella response
              var newApiBackend = apiUmbrellaWebResponse.result.data.api;

              // Add current user as API manager
              newApiBackend.managerIds = [Meteor.userId()];

              // Insert the API Backend
              var apiBackendId = Apis.insert(newApiBackend);

              // Tell Wizard the submission is complete
              context.done();

              // TODO: Redirect to the just created API Backend page
              // Router.go('viewApiBackend', {_id: apiBackendId});
              // Note, this will not work since the API Backend subscription will not be available
              // for the route authorization funciton to work correctly

              // Redirect to the Manage APIs page
              Router.go('manageApiBackends');

              // Get the ID of the newly created API Backend
              // for call to publish API Backend on API Umbrella
              var apiUmbrellaApiId = newApiBackend.id;

              // Publish the API Backend on API Umbrella
              Meteor.call('publishApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

                if (apiUmbrellaWebResponse.http_status === 201) {
                  sAlert.success(TAPi18n.__("addApiBackendWizard_success_apiUmbrellaPublished"));
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
  },
  backButtonText () {
    // Get translation string for next button
    return TAPi18n.__("addApiBackendWizard_backButton_text");
  },
  nextButtonText () {
    // Get translation string for next button
    return TAPi18n.__("addApiBackendWizard_nextButton_text");
  },
  confirmButtonText () {
    // Get translation string for next button
    return TAPi18n.__("addApiBackendWizard_confirmButton_text");
  }
});
