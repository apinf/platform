describe('Search form present', function () {

  beforeEach(function (done) {
    Router.go('/catalogue');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should contain search form at "/catalogue" page', function () {
    var searchForm = $('#header-search-form');

    expect(searchForm).toExist();
  });
});
