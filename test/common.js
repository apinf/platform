var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;

var CommonUtils = {
    url: 'https://nightly.apinf.io',
    buildDriver: function() {
        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        driver.manage().timeouts().setScriptTimeout(5000);
        driver.manage().timeouts().implicitlyWait(5000);
        return driver;
    },
    signIn: function(driver) {
        driver.get(this.url);
        driver.findElement(By.linkText('Sign In')).click();
    },
    signOut: function(driver) {
        var userNameElement = driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]'));
        userNameElement.click();
        driver.findElement(By.xpath('//*[text()="Sign out"]')).click();
        return userNameElement;
    },
    goToDashboard: function(driver) {
        driver.findElement(By.linkText('Go to dashboard')).click();
    },
    dashBoardSignOut: function(driver) {
        driver.sleep(1000);
        driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]')).click();
        driver.findElement(By.xpath('//*[text()="Sign out"]')).click().then(function() {
            driver.sleep(1000);
        });
    },
    signUp: function(driver) {
        driver.get(this.url);
        driver.findElement(By.linkText('Sign Up')).click();
    },
    fillSignInForm: function(driver, userName, password) {
        driver.findElement(By.id('at-field-username_and_email')).sendKeys(userName);
        driver.findElement(By.id('at-field-password')).sendKeys(password);
        driver.findElement(By.id('at-btn')).click();
    },
    fillSignUpForm: function(driver, userName, email, password) {
        driver.findElement(By.id('at-field-username')).sendKeys(userName);
        driver.findElement(By.id('at-field-email')).sendKeys(email);
        driver.findElement(By.id('at-field-password')).sendKeys(password);
        driver.findElement(By.id('at-btn')).click();
    },
    deleteNewUser: function(driver, email) {
        this.signIn(driver);
        this.fillSignInForm(driver, 'apinfdelta', 'apinfdelta');
        this.goToDashboard(driver);
        driver.findElement(By.xpath('/html/body/div/div[1]/div/aside/section/ul/li[5]/a')).click();
        var searchField = driver.findElement(By.xpath('/html/body/div/div[1]/div/div/section/div[1]/div/div/input'));
        email.split('').forEach(function(c) {
            searchField.sendKeys(c);
        });
        driver.findElement(By.xpath('/html/body/div/div[1]/div/div/section/table/tbody/tr/td[1]/span[1]')).click().then(function(){
            driver.sleep(1000);
        });
        driver.findElement(By.xpath('//*[@id="deleteaccount"]/div/div/div[2]/button[2]')).click().then(function() {
            driver.sleep(15000);
        });
        driver.findElement(By.xpath('/html/body/div/div[1]/div/header/nav/div/ul/li[2]/a')).click();
        driver.findElement(By.xpath('/html/body/div/div[1]/div/header/nav/div/ul/li[2]/ul/li[6]/a')).click().then(function() {
            driver.sleep(1000);
        });
    }
};

module.exports = CommonUtils;