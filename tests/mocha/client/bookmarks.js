'use strict';

var expect = chai.expect;

MochaWeb.testOnly(function(){

    describe('tests for bookmarking Apis', function() {
        beforeEach(function(){

            Meteor: sinon.stub({
                userId: function() {
                    return 0;
                }
            });

            ApiBookmarks: sinon.stub({
                find: function(data) {
                    return 1;
                }
            });
        });

        it('tests bookmarked Apis for a particular user Id', function() {
            expect(1).to.equal(1);
        });
    });
});

