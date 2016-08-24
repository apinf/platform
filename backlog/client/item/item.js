import moment from 'moment';

Template.backlogItem.helpers({
  relativeTimeStamp: function (givenTimeStamp) {

    return moment(givenTimeStamp).fromNow();

  },
  itemPriorityClass: function (priority) {

    var priorityClass = "";

    // Check priority value & return specific CSS class for label to display
    switch (priority) {
      case 2:

        priorityClass = 'priority priority-high';

        break;
      case 1:

        priorityClass = 'priority priority-middle';

        break;
      case 0:

        priorityClass = 'priority priority-low';

        break;
    }

    return priorityClass;

  },
  currentUserIsOwner: function (backlogItem) {
    // Get current User ID
    const currentUser = Meteor.userId();

    // Check if current User ID matches backlog User ID
    return currentUser === backlogItem.userId;
  }
});

Template.backlogItem.events({
  'click .edit-backlog-item' () {
    // Show Edit Backlog Item modal
    Modal.show("editBacklogItem", { backlogItem: this.item});
  }
});
