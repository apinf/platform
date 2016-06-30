var path = require('path');
var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing');
var CommonUtils = require('./common');
var AddAPIBackendUtil = require('./addapibackendutil');

test.describe('Manage API Backend', function() {
    this.timeout(60000);
    var driver;
    test.before(function() {
        driver = CommonUtils.buildDriver();
    });
    test.after(function() {
        driver.quit();
    });
    test.afterEach(function() {
        CommonUtils.dashBoardSignOut(driver);
    });
    test.it('10.1 should view api backend details', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        var detailsElement = driver.findElement(By.xpath('//*[@id="api-backend-details"]/div/div[1]/h2'));
        detailsElement.getText().then(function(text) {
            assert.equal('Details', text);
        });
    });
    test.it('10.2 should upload documentation', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        openDocumentation(driver);
        openManageDocument(driver);
        driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input'))
        .sendKeys(path.join(__dirname, 'testfiles/testdocument.json'))
        .then(null, function() {
            driver.findElement(By.xpath('//*[contains(@class,"delete-documentation")]')).click();
            driver.switchTo().alert().accept();
            driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input'))
            .sendKeys(path.join(__dirname, 'testfiles/testdocument.json'))
        });
        driver.findElement(By.xpath('//*[@id="apiBackendDocumentationLinkForm"]/div/input'))
        .sendKeys('https://www.google.co.in').then(function(){
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('//*[@id="save-documentation-link"]')).click();
        var updateAlertElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.3 should delete documentation', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        openDocumentation(driver);
        openManageDocument(driver);
        deleteDocument(driver);
        var updateAlertElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.4 should upload swagger documentation', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        openDocumentation(driver);
        openManageDocument(driver);
        driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input'))
        .sendKeys(path.join(__dirname, 'testfiles/testdocument.json')).then(function(){
            driver.sleep(2000);
        }).then(null, function() {
            driver.findElement(By.xpath('//*[contains(@class,"delete-documentation")]')).click();
            driver.switchTo().alert().accept();
            driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input')).sendKeys(path.join(__dirname, 'testfiles/testdocument.json'))
        });
        driver.findElement(By.xpath('//*[@id="save-documentation-link"]')).click();
        var updateAlertElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.5 should delete and reload swagger documentation', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        openDocumentation(driver);
        openManageDocument(driver);
        driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input'))
        .sendKeys(path.join(__dirname, 'testfiles/testdocument.json')).then(function(){
            driver.sleep(2000);
        }).then(null, function() {
            driver.findElement(By.xpath('//*[contains(@class,"delete-documentation")]')).click();
            driver.switchTo().alert().accept();
            driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input')).sendKeys(path.join(__dirname, 'testfiles/testdocument.json'))
        });
        driver.findElement(By.xpath('//*[@id="save-documentation-link"]')).click().then(function(){
            driver.sleep(2000);
        });
        openManageDocument(driver);
        deleteDocument(driver);
        openManageDocument(driver);
        driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input'))
        .sendKeys(path.join(__dirname, 'testfiles/testdocument.json')).then(function(){
            driver.sleep(2000);
        }).then(null, function() {
            driver.findElement(By.xpath('//*[contains(@class,"delete-documentation")]')).click();
            driver.switchTo().alert().accept();
            driver.findElement(By.xpath('//*[contains(@class,"fileBrowse")]/input')).sendKeys(path.join(__dirname, 'testfiles/testdocument.json'))
        });
        driver.findElement(By.xpath('//*[@id="save-documentation-link"]')).click().then(function(){
            driver.sleep(2000);
        });
        var updateAlertElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.6 should add/edit metadata', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        openMetadata(driver);
        driver.findElement(By.xpath('//*[@id="api-backend-metadata"]/div/div[1]/button')).click();
        driver.findElement(By.xpath('//*[@name="organization.name"]')).sendKeys('Name');
        driver.findElement(By.xpath('//*[@name="organization.description"]')).sendKeys('Description');
        driver.findElement(By.xpath('//*[@name="contact.name"]')).sendKeys('Name');
        driver.findElement(By.xpath('//*[@name="contact.phone"]')).sendKeys('+11111111111');
        driver.findElement(By.xpath('//*[@name="contact.email"]')).sendKeys('aa@bb.ccc');
        driver.findElement(By.xpath('//*[@name="service.name"]')).sendKeys('Name');
        driver.findElement(By.xpath('//*[@name="service.description"]')).sendKeys('Description');
        driver.findElement(By.xpath('//*[@name="service.validSince"]')).sendKeys('01/01/2000');
        driver.findElement(By.xpath('//*[@name="service.validUntil"]')).sendKeys('01/01/2030');
        driver.findElement(By.xpath('//*[@name="service.serviceLevelAgreement"]')).sendKeys('Agreement');
        driver.findElement(By.xpath('//*[@class="btn btn-primary"]')).click().then(function() {
            driver.sleep(2000);
        });
        
        driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]')).click().then(
            function() {
                driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]')).click();
            }, 
            function() {
                driver.findElement(By.xpath('//*[@class="close"]')).click().then(function() {
                driver.sleep(2000);
            });
        });
    });
    test.it('10.7 should add backlog', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        driver.findElement(By.xpath('//*[@href="#api-backend-backlog"]')).click().then(function() {
            driver.sleep(1000);
        });
        driver.findElement(By.xpath('//*[@id="api-backend-backlog"]/div/div[1]/button')).click();
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[1]/div[1]/input')).sendKeys('Backlog Title');
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[2]/div/select/option[2]')).click();
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[1]/div[2]/textarea')).sendKeys('Description');
        driver.findElement(By.xpath('//*[@id="apiBacklogFormSubmit"]')).click().then(function() {
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('//*[@id="api-backend-backlog"]/div/div[2]/div[2]')).then(function(element) {
            element.getText().then(function(text) {
                assert.include(text, 'Thank you! Your backlog item has been successfully published.');
            });
        });
    });
    test.it('10.8 should not add backlog with missing fields', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToManageAPI(driver);
        driver.findElement(By.xpath('//*[@href="#api-backend-backlog"]')).click().then(function() {
            driver.sleep(1000);
        });
        driver.findElement(By.xpath('//*[@id="api-backend-backlog"]/div/div[1]/button')).click();
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[1]/div[1]/input')).sendKeys('Backlog Title');
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[1]/div[2]/textarea')).sendKeys('Description');
        driver.findElement(By.xpath('//*[@id="apiBacklogFormSubmit"]')).click().then(function() {
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('//*[@id="apiBacklogForm"]/div[1]/div[2]/div/span')).then(function(element) {
            element.getText().then(function(text) {
                assert.equal('Priority is required', text);
            });
        });
        driver.findElement(By.xpath('//*[@id="apiBacklogFormModal"]/div/div/div[1]/button/span')).click()
        .then(function() {
            driver.sleep(1000);
        });
    });
    test.it('10.9 should edit api backend details', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        goToEditAPI(driver);
        driver.findElement(By.xpath('//*[@id="apiBackendForm"]/div[4]/select/option[2]')).click();
        var portElement = driver.findElement(By.xpath('//*[@id="apiBackendForm"]/div[5]/ul/li[1]/div/div[2]/div/div[2]/div[2]/input'));
        portElement.clear();
        portElement.sendKeys('9090');
        driver.findElement(By.xpath('//*[@id="add-apibackends"]')).click().then(function() {
            driver.sleep(2000);
        });
        var infoElement = driver.findElement(By.xpath('//*[@class="s-alert-box-inner"]/p'));
        infoElement.getText().then(function(text) {
            assert.equal('API Backend successfully published.', text);
        });
    });
    test.it('10.10 should delete backend', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        var backendElement = driver.findElement(By.xpath('/html/body/div[2]/div[1]/div/div/section/div[1]'));
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click();
        driver.findElement(By.xpath('//*[text()="Delete"]')).click()
        .then(function(){
            driver.sleep(2000);
        }, function() {
             driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
                driver.sleep(2000);
            });
            AddAPIBackendUtil.addNewBackend(driver, {
                backendName: 'NewBackend',
                description: 'Test Description',
                hostName: 'google.com',
                portNumber: '80',
                frontendPrefix: '/test',
                backendPrefix: '/test'
            })
            driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click()
            .then(function(){
                driver.sleep(2000);
            });
            driver.findElement(By.xpath('//*[text()="Delete"]')).click()
            .then(function() {
                driver.sleep(2000);
            });
        });
        driver.findElement(By.xpath('//*[@id="deleteApi"]')).click().then(function(){
            driver.sleep(2000);
        });
        backendElement.isDisplayed().then(null, function(err) {
            assert.equal('StaleElementReferenceError', err.name);
        });
    });
    test.it('10.11 should cancel delete backend', function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click();
        driver.findElement(By.xpath('//*[text()="Delete"]')).click()
        .then(function(){
            driver.sleep(2000);
        }, function() {
             driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
                driver.sleep(2000);
            });
            AddAPIBackendUtil.addNewBackend(driver, {
                backendName: 'NewBackend',
                description: 'Test Description',
                hostName: 'google.com',
                portNumber: '80',
                frontendPrefix: '/test',
                backendPrefix: '/test'
            })
            driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click()
            .then(function(){
                driver.sleep(2000);
            });
            driver.findElement(By.xpath('//*[text()="Delete"]')).click()
            .then(function() {
                driver.sleep(2000);
            });
        });
        driver.findElement(By.xpath('//*[text()="Cancel"]')).click();
    });
});

function goToManageAPI(driver) {
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click();
        driver.findElement(By.xpath('/html/body/div[2]/div[1]/div/div/section/div[1]/div[1]/h2/div[1]/a[1]')).click()
        .then(null, function() {
            driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
                driver.sleep(2000);
            });
            AddAPIBackendUtil.addNewBackend(driver, {
                backendName: 'NewBackend',
                description: 'Test Description',
                hostName: 'google.com',
                portNumber: '80',
                frontendPrefix: '/test',
                backendPrefix: '/test'
            })
            driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click()
            .then(function(){
                driver.sleep(2000);
            });
        });
}

function goToEditAPI(driver) {
    driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/a')).click().then(function(){
        driver.sleep(2000);
    });
    driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[3]/ul/li[2]/a')).click();
    driver.findElement(By.xpath('/html/body/div[2]/div[1]/div/div/section/div[1]/div[1]/h2/div[1]/a[2]')).click();
}

function openDocumentation(driver) {
    driver.findElement(By.xpath('/html/body/div/div[1]/div/div/section/div[2]/div/ul/li[2]/a')).click().then(function(){
        driver.sleep(2000);
    });
}

function openMetadata(driver) {
    driver.findElement(By.xpath('/html/body/div[2]/div[1]/div/div/section/div[2]/div/ul/li[3]/a')).click().then(function(){
        driver.sleep(2000);
    });
}

function openManageDocument(driver) {
    driver.findElement(By.xpath('/html/body/div/div[1]/div/div/section/div[3]/div[2]/div/div[1]/button')).click().then(function(){
        driver.sleep(2000);
    });
}

function deleteDocument(driver) {
    driver.findElement(By.xpath('//*[contains(@class,"delete-documentation")]')).click();
    driver.switchTo().alert().accept();
    driver.findElement(By.xpath('//*[@id="apiBackendDocumentationLinkForm"]/div/input')).clear();
    driver.findElement(By.xpath('//*[@id="save-documentation-link"]')).click().then(function(){
        driver.sleep(2000);
    });
}