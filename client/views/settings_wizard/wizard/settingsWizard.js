Template.settingsWizard.created = function() {
  const instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');
  // Subscribe to project logo collection
  instance.subscribe('projectLogo');
  // Subscription to coverPhoto collection
  instance.subscribe('coverPhoto');
  // Subscription to feedback collection
  instance.subscribe('settings');

};

Template.settingsWizard.helpers({

  branding: function() {
    return Branding.findOne();
  },
  projectLogo: function () {
    // Get last uploaded image from collection
    var lastUploadedLogo = ProjectLogo.findOne({}, {sort: {uploadedAt: -1}});
    // Check if new logo was uploaded, if so change it with previous
    if (lastUploadedLogo) {
      return lastUploadedLogo
    }
  },
  coverPhoto: function () {
    // Get last uploaded image from collection
    var lastUploadedCover = CoverPhoto.findOne({}, {sort: {uploadedAt: -1}});
    // Check if new cover was uploaded, if so change it with previous
    if (lastUploadedCover) {
      return lastUploadedCover;
    }
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
