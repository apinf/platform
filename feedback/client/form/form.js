// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Feedback from '../../collection';

Template.feedbackForm.helpers({
  feedbackCollection () {
    // Return a reference to Feedback collection, for AutoForm
    return Feedback;
  },
});
