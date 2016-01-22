describe('Search form present', function () {

  beforeEach(function (done) {
    Router.go('/catalogue');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should contain search form at "/catalogue" page', function () {

    $(function () {
      var searchForm = $('form#header-search-form');
      expect(searchForm.length).toEqual(1);
    });

  });
});
