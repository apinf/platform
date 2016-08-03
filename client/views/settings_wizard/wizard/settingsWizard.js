Template.settingsWizard.created = function() {
  const instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');
  instance.subscribe('settings');

};

Template.settingsWizard.helpers({

  branding: function() {
    return Branding.findOne();
  },
  formType: function () {
    if ( Settings.findOne() ) {
      // Updating existing Settings
      return 'update';
    } else {
      // Editing Settings
      return 'insert';
    }
  },
  editDoc: function(){
    return Settings.findOne();
  }
});

Template.settingsWizard.events({

  'click #prev-first-slide': function() {
    // clicking Previous of first slide moves to previous slide
    $('#settingsCarousel').carousel('prev');
  },
  'click #next': function() {
    // clicking Save and next of first slide moves to second slide
    $('#settingsCarousel').carousel('next');
  },
  'click #prev-second-slide': function() {
    // clicking Previous of second slide moves to previous slide
    $('#settingsCarousel').carousel('prev');
  }
});

AutoForm.hooks({
  wizardSettings: {
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    }
  }
});

AutoForm.addHooks(['wizardSettings'], {
  onSuccess: function () {
    // Call method to update Meteor.settings
    Meteor.call('updateMeteorSettings');

    // Check if we can create ApiUmbrellaWeb object
    try {
      Meteor.call("createApiUmbrellaWeb");
      Meteor.call("syncApiUmbrellaUsers");
      Meteor.call("syncApiBackends");
      Meteor.call("initialSetupCompleteTrue", function() {
        Router.go("dashboard");
      });
    }
    // otherwise show an error
    catch (error) {
      console.log(error);
    }
  }
});
