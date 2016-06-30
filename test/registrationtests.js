var assert = require('chai').assert;
var faker = require('faker');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    test = require('selenium-webdriver/testing');



test.describe('Registration', function() {
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
    test.it('1.1 should create an account with valid data', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        var userName = faker.internet.userName();
        while (userName.indexOf('.') > -1) {
            userName = faker.internet.userName();
        }
        driver.findElement(By.id('at-field-username')).sendKeys(userName);
        driver.findElement(By.id('at-field-email')).sendKeys(faker.internet.email());
        driver.findElement(By.id('at-field-password')).sendKeys(faker.internet.password());
        driver.findElement(By.id('at-btn')).click();
        var userNameElement = driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/a'));
        userNameElement.getText().then(function(text) {
           assert.equal(text, userName); 
        });
        userNameElement.click();
        driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/ul/li[4]/a')).click();
    });
    test.it('1.2 should not create an account with invalid email addresss', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-field-username')).sendKeys('testName');
        driver.findElement(By.id('at-field-email')).sendKeys('@testName');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var helpTextElement = driver.findElement(By.xpath('//*[@id="at-pwd-form"]/fieldset/div[2]/span'));
        helpTextElement.getText().then(function(text) {
           assert.equal(text, 'Invalid email', 'Invalid email message doesn\'t match'); 
        });
    });
    test.it('1.3 should login to GIT with valid credentials', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-github')).click();
        driver.getAllWindowHandles().then(function(handles) {
            driver.switchTo().window(handles[1]);
        });
        driver.findElement(By.id('login_field')).sendKeys('kumargs');
        driver.findElement(By.id('password')).sendKeys('Delta@123');
        driver.findElement(By.xpath('//*[@id="login"]/form/div[4]/input[3]')).click();
        driver.getAllWindowHandles().then(function(handles) {
            driver.switchTo().window(handles[0]);        
        var userNameElement = driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/a'));
        userNameElement.getText().then(function(text) {
           assert.equal(text, 'kumargs'); 
        });
        userNameElement.click();
        driver.findElement(By.xpath('//*[@id="home-navbar"]/ul/li[2]/ul/li[4]/a')).click();
        driver.get('https://github.com');
        driver.findElement(By.xpath('//*[@id="user-links"]/li[3]/a')).click();
        driver.findElement(By.xpath('//*[@id="user-links"]/li[3]/div/div/form/button')).click();
        });
    });    
    test.it('1.4 should not create github account with invalid email', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-github')).click();
        driver.getAllWindowHandles().then(function(handles) {
            driver.switchTo().window(handles[1]);
        });
        driver.findElement(By.id('login_field')).sendKeys('invalidEmail');
        driver.findElement(By.id('password')).sendKeys('asdfalkjl');
        driver.findElement(By.xpath('//*[@id="login"]/form/div[4]/input[3]')).click();
        var errorElement = driver.findElement(By.xpath('//*[@id="js-flash-container"]/div/div'));
        errorElement.getText().then(function(text) {
            assert.equal(text, "Incorrect username or password.");
        });
        driver.close();
        driver.getAllWindowHandles().then(function(handles) {
            driver.switchTo().window(handles[0]);
        });
    });
    test.it('1.5 should not create an account with missing email field', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-field-username')).sendKeys('testName');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var helpTextElement = driver.findElement(By.xpath('//*[@id="at-pwd-form"]/fieldset/div[2]/span'));
        helpTextElement.getText().then(function(text) {
           assert.equal(text, 'Required Field'); 
        });
    });
    test.it('1.6 should show unknown validation error with special character email field', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-field-username')).sendKeys('testName');
        driver.findElement(By.id('at-field-email')).sendKeys('abc@testName.com"###"');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var errorElement = driver.findElement(By.xpath('/html/body/div/div/div/div/div/div[4]/p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'Unknown validation error'); 
        });
    });
    test.it('1.7 should show profile user name invalid with special character username field', function() {
        driver.get('https://nightly.apinf.io');
        driver.findElement(By.linkText('Sign Up')).click();
        driver.findElement(By.id('at-field-username')).sendKeys('testName&&&');
        driver.findElement(By.id('at-field-email')).sendKeys('abc@testName.com');
        driver.findElement(By.id('at-field-password')).sendKeys('password');
        driver.findElement(By.id('at-btn')).click();
        var errorElement = driver.findElement(By.xpath('/html/body/div/div/div/div/div/div[4]/p'));
        errorElement.getText().then(function(text) {
           assert.equal(text, 'profile-usernameInvalid');
        });
    });
});