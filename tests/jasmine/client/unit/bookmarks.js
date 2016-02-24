'use strict';

describe("tests for bookmarked Apis", function() {

    it("checks if the userId function of Meteor is called", function() {
        spyOn(Meteor, 'userId').and.callThrough();
        Template.bookmarks.__helpers[' userBookmarks']();
        expect(Meteor.userId).toHaveBeenCalled();
    });

    it("checks if the find function of ApiBookmarks is called once", function() {
        spyOn(Meteor, 'userId').and.callThrough();
        spyOn(ApiBookmarks, 'find').and.callThrough();
        Template.bookmarks.__helpers[' userBookmarks']();
        expect(ApiBookmarks.find.calls.count()).toBe(1);
    });
});
