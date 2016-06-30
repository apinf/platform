var assert = require('chai').assert;
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    test = require('selenium-webdriver/testing');



test.describe('Login', function() {
    this.timeout(60000);
    var driver;
    test.before(function() {
        driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        driver.manage().timeouts().setScriptTimeout(5000);
        driver.manage().timeouts().implicitlyWait(5000);
    });
    test.after(function() {
        driver.quit();
    });
    test.it('2.1 should login with valid username and password', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign In')).click();
        driver.findElement(By.id('at-field-username_and_email')).sendKeys('test@test.test');
        driver.findElement(By.id('at-field-password')).sendKeys('testuser');
        driver.findElement(By.id('at-btn')).click();
        var userNameElement = driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/a'));
        userNameElement.getText().then(function(text) {
           assert.equal(text, 'testuser'); 
        });
        userNameElement.click();
        driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/ul/li[4]/a')).click();
    });
    test.it('2.2 should show login forbidden message with invalid username', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign In')).click();
        driver.findElement(By.id('at-field-username_and_email')).sendKeys('testName');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var errorElement = driver.findElement(By.xpath('/html/body/div/div/div/div/div/div[4]/p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'Login forbidden'); 
        });
    });
    test.it('2.3 should show login forbidden message with invalid password', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign In')).click();
        driver.findElement(By.id('at-field-username_and_email')).sendKeys('test@test.test');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var errorElement = driver.findElement(By.xpath('/html/body/div/div/div/div/div/div[4]/p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'Login forbidden'); 
        });
    });
});