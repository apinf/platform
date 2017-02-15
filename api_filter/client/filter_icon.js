Template.apisFilterIcon.events({
  'click #filter-icon': (event, templateInstance) => {
    // Show/hide filter options
    templateInstance.$('.filter-popup').toggleClass('filter-popup-visible');
  },
});
