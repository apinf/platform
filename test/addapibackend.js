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
        email: "",
        password: ""
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
            var mainPage = CommonUtils.deleteNewUser(driver, newUser.email, newUser.password);
            mainPage.getText().then(function(text) {
                assert.equal('Latest APIs', text);
            });
        }
    });
    test.it('8.1 should add/publish api backend as a new user', function() {
        CommonUtils.signUp(driver);
        var userName = faker.internet.userName();
        while (userName.indexOf('.') > -1 || userName.indexOf('_') > -1) {
            userName = faker.internet.userName();
        }
        var email = faker.internet.email();
        var password = faker.internet.password();
        newUser.added = true;
        newUser.email = email;
        newUser.password = password;
        CommonUtils.fillSignUpForm(driver, userName, email, password);
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            apiName: 'NewBackend v2',
            apiDescription: 'Test Description',
            apiURL: 'http://google.com'
        });
        var publishedAPIHostElement = driver.findElement(By.id('api-header'));
        publishedAPIHostElement.getText().then(function(text){
            assert.equal(text, 'NewBackend v2');
        });
    });
    test.it('8.2 should add/publish api backend as a registered user who doesn\'t own any api', function(){
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            apiName: 'NewBackend',
            apiDescription: 'Test Description',
            apiURL: 'http://google.com'
        });
        var publishedAPIHostElement = driver.findElement(By.id('api-header'));
        publishedAPIHostElement.getText().then(function(text){
            assert.equal(text, 'NewBackend');
        });
    });
    test.it('8.3.1 should not add/publish api backend with missing API name field', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        var values = {
            apiDescription: 'Test Description',
            apiURL: 'http://google.com'
        };
        AddAPIBackendUtil.clickAddNewBackend(driver);
        AddAPIBackendUtil.fillApiDescription(driver, values);
        AddAPIBackendUtil.fillApiURL(driver, values);
        AddAPIBackendUtil.savingInformational(driver);
        var hostRequiredErrorElement = driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[1]/span'));
        hostRequiredErrorElement.getText().then(function(text) {
            assert.equal(text, 'API Name is required');
        });
    });
    test.it('8.3.2 should not add/publish api backend with missing URL field', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        var values = {
            apiName: 'NewBackend',
            apiDescription: 'Test Description'
        };
        AddAPIBackendUtil.clickAddNewBackend(driver);
        AddAPIBackendUtil.fillApiName(driver, values);
        AddAPIBackendUtil.fillApiDescription(driver, values);
        AddAPIBackendUtil.savingInformational(driver);
        var hostRequiredErrorElement = driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[3]/span'));
        hostRequiredErrorElement.getText().then(function(text) {
            assert.equal(text, 'URL is required');
        });
    });
    test.it('8.4 should not add/publish api backend with invalid host name', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        AddAPIBackendUtil.addNewBackend(driver, {
            apiName: 'NewBackend',
            apiDescription: 'Test Description',
            apiURL: 'google.com'
        });
        var errorElement = driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[3]/span'));
        errorElement.getText().then(function(text){
            assert.include(text, 'URL must be a valid URL');
        });
    });
    test.it('8.5 should not add/publish api with no unique name', function() {
        newUser.added = false;
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        var values = {
            apiName: 'NewBackend',
            apiDescription: 'Test Description',
            apiURL: 'http://google.com'
        };
        AddAPIBackendUtil.addNewBackend(driver, values);
        var errorElement = driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[1]/span'));
        errorElement.getText().then(function(text){
            assert.include(text, 'API Name must be unique');
        });
    });
});