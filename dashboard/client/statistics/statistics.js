Template.statisticsSummary.onRendered(function() {
  $('.statistics-summary-number').each(function () {
    var $this = $(this);
    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
      duration: 1000,
      easing: 'swing',
      step: function () {
        $this.text(Math.ceil(this.Counter));
      }
    });
  });
});
