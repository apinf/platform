var By = require('selenium-webdriver').By;

var AddAPIBackend = {
    addNewBackend: function(driver, values) {
        this.clickAddNewBackend(driver);
        this.fillBaseInformation(driver, values);
        this.fillBackendInformation(driver, values);
        this.fillMatchingURLPrefixes(driver, values);
    },

    clickAddNewBackend: function(driver) {
        driver.findElement(By.xpath('//*[text()="API Backends"]')).click().then(function() {
            driver.sleep(2000);
        });
        driver.findElement(By.xpath('//*[text()="Add API Backend"]')).click();
    },

    fillBaseInformation: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="base-information-form"]/div/input')).sendKeys(values.backendName);
        driver.findElement(By.xpath('//*[@id="base-information-form"]/nav/button')).click();
    },

    fillBackendInformation: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="backend-information-form"]/div[1]/select/option[3]')).click();
        driver.findElement(By.xpath('//*[@id="backend-information-form"]/div[2]/input')).sendKeys(values.hostName);
        driver.findElement(By.xpath('//*[@id="backend-information-form"]/div[3]/input')).sendKeys(values.portNumber);
        driver.findElement(By.xpath('//*[@id="backend-information-form"]/nav/button[2]')).click();
    },

    fillMatchingURLPrefixes: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="prefixes-information-form"]/div/div[2]/div[1]/input')).sendKeys(values.frontendPrefix);
        driver.findElement(By.xpath('//*[@id="prefixes-information-form"]/div/div[2]/div[2]/input')).sendKeys(values.backendPrefix);
        driver.findElement(By.xpath('//*[@id="prefixes-information-form"]/nav/button[2]')).click();
    }
}

module.exports = AddAPIBackend;