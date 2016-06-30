var assert = require('chai').assert;
var faker = require('faker');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    test = require('selenium-webdriver/testing');
var CommonUtils = require('./common');
var AddAPIBackendUtil = require('./addapibackendutil');

test.describe('Add API Backend', function() {
    this.timeout(60000);
    var driver;
    var newUser = {
        added: false,
        email: ""
    };
    test.before(function() {
        driver = CommonUtils.buildDriver();
    });
    test.after(function() {
        driver.quit();
    });
    test.afterEach(function() {
        CommonUtils.dashBoardSignOut(driver);
        if (newUser.added) {
            CommonUtils.deleteNewUser(driver, newUser.email);
        }
    });
    test.it('8.1 should add/publish api backend as a new user', function() {
        CommonUtils.signUp(driver);
        var userName = faker.internet.userName();
        while (userName.indexOf('.') > -1 || userName.indexOf('_') > -1) {
            userName = faker.internet.userName();
        }
        var email = faker.internet.email();
        newUser.added = true;
        newUser.email = email;
        CommonUtils.fillSignUpForm(driver, userName, email, faker.internet.password());
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            backendName: 'NewBackend',
            description: 'Test Description',
            hostName: 'google.com',
            portNumber: '80',
            frontendPrefix: '/test',
            backendPrefix: '/test'
        });
        var publishedAPIHostElement = driver.findElement(By.xpath('//*[@class="page-title"]'));
        publishedAPIHostElement.getText().then(function(text){
            assert.equal(text, 'NewBackend');
        });
    });
    test.it('8.2 should add/publish api backend as a registered user who doesn\'t own any api', function(){
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            backendName: 'NewBackend',
            description: 'Test Description',
            hostName: 'google.com',
            portNumber: '80',
            frontendPrefix: '/test',
            backendPrefix: '/test'
        });
        var publishedAPIHostElement = driver.findElement(By.xpath('//*[@class="page-title"]'));
        publishedAPIHostElement.getText().then(function(text){
            assert.equal(text, 'NewBackend');
        });
    });
    test.it('8.3 should not add/publish api backend with missing fields', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        var values = {
            backendName: 'NewBackend',
            description: 'Test Description',
            hostName: '',
            portNumber: '80',
        };
        AddAPIBackendUtil.clickAddNewBackend(driver);
        AddAPIBackendUtil.fillBaseInformation(driver, values);
        AddAPIBackendUtil.fillBackendInformation(driver, values);
        var hostRequiredErrorElement = driver.findElement(By.xpath('//*[@id="backend-information-form"]/div[2]/span'));
        hostRequiredErrorElement.getText().then(function(text) {
            assert.equal(text, 'Host is required');
        });
    });
    test.it('8.4 should not add/publish api backend with invalid host name', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            backendName: 'NewBackend',
            description: 'Test Description',
            hostName: 'google',
            portNumber: '80',
            frontendPrefix: '/test',
            backendPrefix: '/test'
        });
        var errorElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        errorElement.getText().then(function(text){
            assert.include(text, 'Could not resolve host: no address for google');
        });
    });
});