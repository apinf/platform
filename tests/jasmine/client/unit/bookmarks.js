describe("tests for bookmarked Apis", function() {

    beforeAll(function() {
        var Meteor = {
            userId: function() {
                return 1;
            }
        };
        var ApiBookmarks = {
            find: function() {
                return 0;
            }
        };
        
    });

    it("checks if the userId function of Meteor is called", function() {
        spyOn(Meteor, 'userId').and.callThrough();
        Template.bookmarks.__helpers[' userBookmarks']();
        expect(Meteor.userId).toHaveBeenCalled();
    });

    it("checks if the find function of ApiBookmarks is called once", function() {
        spyOn(ApiBookmarks, 'find').and.callThrough();
        Template.bookmarks.__helpers[' userBookmarks']();
        expect(ApiBookmarks.find.calls.count()).toBe(1);
    });
});
