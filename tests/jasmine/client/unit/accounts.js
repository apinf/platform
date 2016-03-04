'use strict';

describe('Test events and helpers in user account template', function() {

    it('test call to click event handler in template', function() {
        spyOn(Meteor, 'call').and.callThrough();
        Template.account.fireEvent('click .js-delete-account');
        expect(Meteor.call.calls.count()).toBe(1);
    });

    it('test call to Meteor.userId() stub when firing event handler', function() {

        spyOn(Meteor, 'userId').and.callFake(function() {
            return 1;
        });
        Template.account.fireEvent('click .js-delete-account');
        expect(Meteor.userId.calls.count()).toBe(1);
    });

    it('test arguments passed to event handler', function() {

        spyOn(Meteor, 'userId').and.callFake(function() {
            return 1;
        });
        spyOn(Meteor, 'call').and.callThrough();
        Template.account.fireEvent('click .js-delete-account');
        expect(Meteor.call.calls.argsFor(0)).toEqual(['deleteAccount', 1]);
    });

    it('test user helper returns user profile information', function() {
        spyOn(Meteor, 'user').and.callFake(function() {
            return {
                username: 'Testuser'
            };
        });
        expect(Template.setUserName.__helpers[' user']().username).toBe('Testuser');
    });
});
