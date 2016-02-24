describe("branding helpers tests", function() {

    it("test findOne is called once in the branding helper", function() {
        spyOn(Branding, 'findOne').and.callThrough();
        Template.branding.__helpers[' branding']();
        expect(Branding.findOne.calls.count()).toBe(1);
    });

    it("test arguments with which findOne is called in projectLogo helper", function() {
        spyOn(ProjectLogo, 'findOne').and.callThrough();
        Template.branding.__helpers[' projectLogo']();
        expect(ProjectLogo.findOne).toHaveBeenCalledWith({}, {sort: {uploadedAt: -1}});
    });

    it("test arguments with which findOne is called in coverPhoto helper", function() {
        spyOn(CoverPhoto, 'findOne').and.callThrough();
        Template.branding.__helpers[' coverPhoto']();
        expect(CoverPhoto.findOne).toHaveBeenCalledWith({}, {sort: {uploadedAt: -1}});
    });
});
