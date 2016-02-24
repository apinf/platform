'use strict';

describe('test catalogue helpers', function() {

    it('tests if ApiBookmarks.findOne() is called once', function() {
        spyOn(ApiBookmarks, 'findOne').and.callThrough();
        Template.catalogue.__helpers[' userHasBookmarks']();
        expect(ApiBookmarks.findOne.calls.count()).toBe(1);
    });

    it('test that the userHasBookmarks helper returns true when apiIds array is not null', function() {
        spyOn(ApiBookmarks, 'findOne').and.callFake(function() {
            return {
                apiIds: [1, 2, 3, 4]
            };            
        });
        expect(Template.catalogue.__helpers[' userHasBookmarks']()).toEqual(true);
    });

    it('test userHasBookmarks helper returns false when apiIds array is empty', function() {
        spyOn(ApiBookmarks, 'findOne').and.callFake(function() {
            return {
                apiIds: []
            };
        });
        expect(Template.catalogue.__helpers[' userHasBookmarks']()).toEqual(false);
    });
});
