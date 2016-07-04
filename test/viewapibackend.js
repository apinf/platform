var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    test = require('selenium-webdriver/testing');
var CommonUtils = require('./common');

test.describe('View API Backend', function() {
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
        CommonUtils.fillSignInForm(driver, 'test@test.test', 'testuser');
        CommonUtils.goToDashboard(driver);
        viewAPIDetails(driver);
    });
    test.it('9.1 should view documentation', function() {
        driver.findElement(By.xpath('//*[@href="#api-backend-documentation"]')).click();
        var documentationElement = driver.findElement(By.xpath('//*[@id="api-backend-documentation"]//*[contains(@class, "panel-title")]'));
        driver.wait(function() {
            return documentationElement.isDisplayed();
        }, 10000);
        documentationElement.getText().then(function(text) {
            assert.equal(text, 'Documentation');
        });
    });
    test.it('9.2 should send feedback', function() {
        driver.findElement(By.xpath('//*[@href="#api-backend-feedback"]')).click();
        var sendFeedBackElement = driver.findElement(By.xpath('//*[@id="api-backend-feedback"]//button[text()="Send feedback"]'));
        driver.wait(function() {
            return sendFeedBackElement.isDisplayed();
        }, 5000);
        sendFeedBackElement.click();
        driver.findElement(By.xpath('//*[@id="feedback"]/div[1]/input')).sendKeys('Test Feedback');
        driver.findElement(By.xpath('//*[@id="feedback"]/div[2]/textarea')).sendKeys('Test Message');
        driver.findElement(By.xpath('//*[@id="feedback"]/div[3]/select/option[2]')).click();
        driver.findElement(By.xpath('//*[@id="feedback"]/div[4]/button')).click();
        
        var feedbackSuccessElement = driver.findElement(By.xpath('//*[@id="feedbackForm"]/div/div[2]'));
        driver.wait(function() {
            return feedbackSuccessElement.isDisplayed();
        }, 10000);
        feedbackSuccessElement.getText().then(function(text) {
            assert.include(text, 'Thank you! Your feedback has been successfully sent.');
        });
        driver.findElement(By.xpath('//*[@class="close"]')).click();
    });
    test.it('9.3 should not send feedback with missing fields', function() {
        driver.findElement(By.xpath('//*[@href="#api-backend-feedback"]')).click();
        var sendFeedBackElement = driver.findElement(By.xpath('//*[@id="api-backend-feedback"]//button[text()="Send feedback"]'));
        driver.wait(function() {
            return sendFeedBackElement.isDisplayed();
        }, 5000);
        sendFeedBackElement.click();
        driver.findElement(By.xpath('//*[@id="feedback"]/div[1]/input')).sendKeys('Test Feedback');
        driver.findElement(By.xpath('//*[@id="feedback"]/div[2]/textarea')).sendKeys('Test Message');
        driver.findElement(By.xpath('//*[@id="feedback"]/div[4]/button')).click();
        
        var changeTypeRequiredElement = driver.findElement(By.xpath('//*[@id="feedback"]/div[3]/span'));
        changeTypeRequiredElement.getText().then(function(text) {
            assert.include(text, 'Choose message type is required');
        });
        driver.findElement(By.xpath('//*[@class="close"]')).click();
    });
});

function viewAPIDetails(driver) {
    driver.findElement(By.xpath('//*[text()="Catalogue"]')).click();
    driver.findElement(By.xpath('//*[@class="api-card-name"]')).click().then(function() {
        driver.sleep(10000);
    });
}