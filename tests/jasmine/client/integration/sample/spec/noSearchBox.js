describe('Search form not present', function () {
  beforeEach(function (done) {
    Router.go('/catalogue');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should not contain search form at "/catalogue" page', function () {

    expect($('form#header-search-form').length).toEqual(1);

  });
});
