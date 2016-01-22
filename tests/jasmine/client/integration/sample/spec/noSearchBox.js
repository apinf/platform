describe('Search form not present', function () {

  beforeEach(function (done) {
    Router.go('/search');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should not contain search form at "/search" page', function () {

    $(function () {
      var searchForm = $('form#header-search-form');
      expect(searchForm.length).toEqual(0);
    });

  });
});
