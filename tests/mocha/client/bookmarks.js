'use strict';

var expect = chai.expect;

MochaWeb.testOnly(function(){

    describe('tests for bookmarking Apis', function() {

        function helper(name) {
            return Template.bookmarks.helpers.firstCall.args[0][name];
        }

        beforeEach(function(){

            ApiBookmarks: sinon.stub({
                find: function(data) {
                    return 1;
                }
            });
        });

        it('tests bookmarked Apis for a particular user Id', function() {
            helper('userBookmarks')();
            expect(ApiBookmarks.find.calledOnce).toBeTruthy();
        });
    });
});

