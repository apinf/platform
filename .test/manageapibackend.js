var path = require('path');
var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
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
    test.beforeEach(function() {
        CommonUtils.signIn(driver);
        CommonUtils.fillSignInForm(driver, 'robot@test.com', 'robottest');
        CommonUtils.goToCatalog(driver);
        goToManageAPI(driver);
    });
    test.it('10.1 should view api backend details', function() {
        var detailsElement = driver.findElement(By.css('#api-details h2'));
        detailsElement.getText().then(function(text) {
            assert.equal('Details', text);
        });
    });
    test.it('10.2 should edit api backend details', function() {
        // Navigate to Settings tab
        driver.findElement(By.id('api-settings-tab')).click();
        // Create phrase to insert in Description
        var newDescription  = ' Date:' + new Date();
        driver.findElement(By.css('#apiBackendForm textarea[name="description"]')).sendKeys(newDescription);
        // Save settings

        driver.findElement(By.id('save-settings')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Navigate to Details tab
        driver.findElement(By.id('api-details-tab')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Verify that Description has new words
        var infoElement = driver.findElement(By.css('.api-details-block p'));
        infoElement.getText().then(function(text) {
            assert.include(text, newDescription);
        });
    });
    test.it('10.3 should only upload documentation and insert documentation link', function() {
        openDocumentationTab(driver);
        openManageModal(driver);
        uploadDocumentation(driver);
        addDocumentationLink(driver);
        // Click on Save button
        driver.findElement(By.id('save-documentation-link')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Verify sAlert has text "successful"
        var updateAlertElement = driver.findElement(By.css('.s-alert-box-inner p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.4 should delete and reload documentation', function() {
        openDocumentationTab(driver);
        openManageModal(driver);
        // Delete documentation, clear link and save
        deleteDocument(driver);
        openManageModal(driver);
        uploadDocumentation(driver);
        addDocumentationLink(driver);
        // Click on Save button
        driver.findElement(By.id('save-documentation-link')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Verify sAlert has text "successful"
        var updateAlertElement = driver.findElement(By.css('.s-alert-box-inner p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.5 should delete documentation', function() {
        openDocumentationTab(driver);
        openManageModal(driver);
        deleteDocument(driver);
        // Verify sAlert has text "successful"
        var updateAlertElement = driver.findElement(By.css('.s-alert-box-inner p'));
        updateAlertElement.getText().then(function(text) {
            assert.include(text, 'successfull');
        });
    });
    test.it('10.6 should add/edit metadata', function() {
        // Open Metadata tab
        driver.findElement(By.id('api-metadata-tab')).click()
            .then(function(){
                driver.sleep(1000);
            });
        // Fill metadata fields
        fillMetadataFields(driver);
        // Save information
        driver.findElement(By.css('#editApiMetadataForm button')).click()
            .then(function() {
                driver.sleep(1000);
            });
    });
    test.it('10.7 should add backlog', function() {
        // Open Backlog tab
        driver.findElement(By.id('api-backlog-tab')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Fill fields and save
        driver.findElement(By.id('add-backlog-item')).click();
        driver.findElement(By.css('#addApiBacklogItemForm input')).sendKeys('Backlog Title');
        driver.findElement(By.css('#addApiBacklogItemForm textarea')).sendKeys('Description');
        driver.findElement(By.css('#addApiBacklogItemForm option:nth-child(2)')).click();
        driver.findElement(By.css('#addApiBacklogItemForm button')).click()
            .then(function() {
                driver.sleep(1000);
            });
        var footer = driver.findElement(By.css('.panel-footer i'));
        footer.getText().then(function(text) {
            // TODO: change condition after adding sAlert on Add
            assert.include(text, 'a minute ago');// a few seconds ago
        });
    });
    test.it('10.8 should not add backlog with missing fields', function() {
        // Open Backlog tab
        driver.findElement(By.id('api-backlog-tab')).click()
            .then(function() {
                driver.sleep(1000);
            });

        // Button "Add backlog item"
        driver.findElement(By.id('add-backlog-item')).click();
        // Fill Title and Description fields and try to save
        driver.findElement(By.css('#addApiBacklogItemForm input')).sendKeys('Backlog Title');
        driver.findElement(By.css('#addApiBacklogItemForm textarea')).sendKeys('Description');
        driver.findElement(By.css('#addApiBacklogItemForm button')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Verify
        var infoElement = driver.findElement(By.css('#addApiBacklogItemForm select + span'));
        infoElement.getText().then(function(text) {
            assert.equal('Priority is required', text);
        });
        // Close modal form
        driver.findElement(By.css('[aria-labelledby="apiBacklogFormModalLabel"] button')).click()
            .then(function() {
                driver.sleep(1000);
            });
    });
    test.it('10.9 should cancel delete api', function() {
        // Navigate to Settings tab
        driver.findElement(By.id('api-settings-tab')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Click on Delete button
        driver.findElement(By.id('delete-api')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Cancel deletion
        driver.findElement(By.xpath('//*[text()="Cancel"]')).click()
            .then(function() {
                driver.sleep(1000);
            });
    });
    test.it('10.10 should delete api', function() {
        // Navigate to Settings tab
        driver.findElement(By.id('api-settings-tab')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Click on Delete button
        driver.findElement(By.id('delete-api')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Confirm deletion
        driver.findElement(By.id('modal-delete-api')).click()
            .then(function() {
                driver.sleep(1000);
            });
        // Verify
        var deleteAlertElement = driver.findElement(By.css('.s-alert-box-inner p'));
        deleteAlertElement.getText().then(function(text) {
            assert.include(text, 'Successfully deleted API:');
        });
    });
});

function goToManageAPI(driver) {
    // Find managed IP
    driver.findElement(By.css('.filter-options-menu label:nth-child(2)')).click()
        .then(function() {
            driver.sleep(1000);
        });
    // Try to select the first managed api
    driver.findElement(By.className('api-card-name')).click()
        .then(null, function() {
            // Create another one if doesn't have anyone
            AddAPIBackendUtil.clickAddNewBackend(driver);
            AddAPIBackendUtil.addNewBackend(driver, {
                apiName: 'API new',
                apiDescription: 'Test Description',
                apiURL: 'http://test.com'
            });
        });
}

function fillMetadataFields(driver) {
    driver.findElement(By.css('#api-metadata button')).click();
    driver.findElement(By.name('organization.name')).sendKeys('Name');
    driver.findElement(By.name('organization.description')).sendKeys('Description');
    driver.findElement(By.name('contact.name')).sendKeys('Name');
    driver.findElement(By.name('contact.phone')).sendKeys('+11111111111');
    driver.findElement(By.name('contact.email')).sendKeys('aa@bb.ccc');
    driver.findElement(By.name('service.name')).sendKeys('Name');
    driver.findElement(By.name('service.description')).sendKeys('Description');
    driver.findElement(By.name('service.validSince')).sendKeys('01/01/2000');
    driver.findElement(By.name('service.validUntil')).sendKeys('01/01/2030');
    driver.findElement(By.name('service.serviceLevelAgreement')).sendKeys('Agreement');
}

function openDocumentationTab(driver) {
    driver.findElement(By.id('api-documentation-tab')).click()
        .then(function(){
            driver.sleep(1000);
        });
}

function openManageModal(driver) {
    driver.findElement(By.id('manage-api-documentation')).click()
        .then(function(){
            driver.sleep(1000);
        });
}

function deleteDocument(driver) {
    driver.findElement(By.className('delete-documentation')).click();
    driver.switchTo().alert().accept();
    driver.findElement(By.name('documentation_link')).clear();
    driver.findElement(By.id('save-documentation-link')).click()
        .then(function(){
            driver.sleep(1000);
        });
}

function uploadDocumentation(driver) {
    driver.findElement(By.css('#file-browse input'))
        .sendKeys(path.join(__dirname, 'files/documentation.json'))
        .then(function() {
            driver.sleep(3000);
        });
}

function addDocumentationLink(driver) {
    driver.findElement(By.name('documentation_link'))
        .sendKeys('https://www.google.co.in')
        .then(function(){
            driver.sleep(1000);
        });
}
