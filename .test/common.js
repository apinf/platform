/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;

var CommonUtils = {
    url: 'http://localhost:3000',
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
        driver.findElement(By.linkText('Dashboard')).click();
    },
    goToCatalog: function(driver) {
        driver.findElement(By.xpath('//*[@id="main-navbar"]/ul[1]/li[2]/a')).click();
    },
    dashBoardSignOut: function(driver) {
        driver.sleep(1000);
        driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]')).click();
        driver.findElement(By.xpath('//*[text()="Sign out"]')).click().then(function() {
            driver.sleep(1000);
        });
    },
    signUp: function(driver) {
        driver.get(this.url).then(function () {
            driver.sleep(1000);
        });
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
        driver.findElement(By.id('at-field-password_again')).sendKeys(password);
        driver.findElement(By.id('at-btn')).click();
    },
    deleteNewUser: function(driver, email, password) {
        this.signIn(driver);
        this.fillSignInForm(driver, email, password);
        // Navigate to Account
        var userNameElement = driver.findElement(By.xpath('//*[@class="dropdown-toggle"][@role="button"]'));
        userNameElement.click();
        driver.findElement(By.xpath('//*[text()="Account"]')).click();
        driver.findElement(By.id('delete-account-button')).click().then(function() {
            driver.sleep(1000);
        });
        driver.findElement(By.id('delete-account-confirm')).click().then(function() {
            driver.sleep(1000);
        });
        // Navigated to main page
        var mainPage = driver.findElement(By.xpath('//*[@id="features"]/div[1]/div[1]/div/h2'));
        return mainPage;
    }
};

module.exports = CommonUtils;
