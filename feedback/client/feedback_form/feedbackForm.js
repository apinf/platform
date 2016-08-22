import { Feedback } from '/feedback/collection';

Template.feedbackForm.helpers({
  feedbackCollection () {
    // Return reference to Feedback collection
    return Feedback;
  }
});
