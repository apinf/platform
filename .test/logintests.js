var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    test = require('selenium-webdriver/testing');
var CommonUtils = require('./common');
var robotUser = {
    email: 'robot@test.com',
    psswd: 'robottest'
};


test.describe('Login', function() {
    this.timeout(60000);
    var driver;
    test.before(function() {
        driver = CommonUtils.buildDriver();
    });
    test.after(function() {
        driver.quit();
    });
    test.it('2.1 should login with valid username and password', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, robotUser.email, robotUser.psswd);
        var userNameElement = CommonUtils.signOut(driver);
        userNameElement.getText().then(function(text) {
           assert.include(text, 'seleniumrobot');
        });
    });
    test.it('2.2 should show login forbidden message with invalid username', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'testName', robotUser.psswd);
        var errorElement = driver.findElement(By.css('.at-error.alert.alert-danger p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'Login forbidden'); 
        });
    });
    test.it('2.3 should show login forbidden message with invalid password', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, robotUser.email, 'password');
        var errorElement = driver.findElement(By.css('.at-error.alert.alert-danger p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'Login forbidden'); 
        });
    });
});