import { Feedback } from '/feedback/collection';

Template.feedbackForm.helpers({
  feedbackCollection () {
    // Return reference to Feedback collection
    return Feedback;
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
