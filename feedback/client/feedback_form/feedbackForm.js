import { Feedback } from '../../collection';

Template.feedbackForm.helpers({
  feedbackCollection () {
    // Return reference to Feedback collection
    return Feedback;
  }
});
