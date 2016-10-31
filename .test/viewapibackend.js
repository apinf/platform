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
        CommonUtils.fillSignInForm(driver, 'robot@test.com', 'robottest');
        driver.sleep(2000);
        viewAPIDetails(driver);
    });
    test.it('9.1 should view documentation', function() {
        // Get documentationTab element & click it
        var documentationTab = driver.findElement(By.xpath('//*[@href="#api-documentation"]'));
        documentationTab.click();
        // Get documentation panel header element
        var documentationHeader = driver.findElement(By.xpath('//*[@id="api-documentation"]//*[contains(@class, "panel-title")]'));
        driver.wait(function() {
            return documentationHeader.isDisplayed();
        }, 2000);
        // Verify panel header has text "Documentation"
        documentationHeader.getText().then(function(text) {
            assert.equal(text, 'Documentation');
        });
    });
    test.it('9.2 should send feedback', function() {
        // Get feedbackTab element & click it
        var feedbackTab = driver.findElement(By.xpath('//*[@href="#api-feedback"]'));
        feedbackTab.click();
        // Get feedback panel, find send feedback button
        var sendFeedBackButton = driver.findElement(By.xpath('//button[@id="add-feedback"]'));
        driver.wait(function() {
            return sendFeedBackButton.isDisplayed();
        }, 2000);
        sendFeedBackButton.click();
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div/div/input)[2]')).sendKeys('Test Feedback');
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div/div[2]/textarea)[2]')).sendKeys('Test Message');
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div/div[3]/select/option[@value="Feedback"])[2]')).click();
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div[2]/button)[2]')).click();

        var feedbackSuccessElement = driver.findElement(By.xpath('//*[@id="home"]/div/div[1]/div[3]/span'));
        feedbackSuccessElement.getText().then(function(text) {
            assert.include(text, 'Test Feedback');
        });
    });
    test.it('9.3 should not send feedback with missing fields', function() {
        // Get feedbackTab element & click it
        var feedbackTab = driver.findElement(By.xpath('//*[@href="#api-feedback"]'));
        feedbackTab.click();
        // Get feedback panel, find send feedback button
        var sendFeedBackButton = driver.findElement(By.xpath('//button[@id="add-feedback"]'));
        driver.wait(function() {
            return sendFeedBackButton.isDisplayed();
        }, 2000);
        sendFeedBackButton.click();
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div/div/input)[2]')).sendKeys('Test Feedback');
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div/div[2]/textarea)[2]')).sendKeys('Test Message');
        driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div[2]/button)[2]')).click();

        // Wait for validation error
        driver.sleep(1000);
        var changeTypeRequiredElement = driver.findElement(By.xpath('(//form[@id="feedbackForm"]/div[1]/div[3]/span)[2]'));
        changeTypeRequiredElement.getText().then(function(text) {
            assert.include(text, 'Choose message type is required');
        });
        // CLose modal
        driver.findElement(By.xpath('(//*[@id="feedbackFormModal"]/div/div/div/button)[2]')).click();
    });
});

function viewAPIDetails(driver) {
    driver.findElement(By.xpath('//*[text()="Catalog"]')).click();
    driver.findElement(By.xpath('//*[@class="api-card-name"]')).click().then(function() {
        driver.sleep(2000);
    });
}
