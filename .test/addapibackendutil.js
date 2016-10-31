var By = require('selenium-webdriver').By;

var AddAPIBackend = {
    addNewBackend: function(driver, values) {
        this.clickAddNewBackend(driver);
        this.fillApiName(driver, values);
        this.fillApiDescription(driver, values);
        this.fillApiURL(driver, values);
        this.savingInformation(driver);
    },

    clickAddNewBackend: function(driver) {
        driver.findElement(By.xpath('//*[text()="Add API"]')).click();
    },

    fillApiName: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[1]/input')).sendKeys(values.apiName);
    },

    fillApiDescription: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[2]/textarea')).sendKeys(values.apiDescription);
    },

    fillApiURL: function(driver, values) {
        driver.findElement(By.xpath('//*[@id="addApiForm"]/fieldset/div[3]/input')).sendKeys(values.apiURL);
    },

    savingInformation: function(driver) {
        driver.findElement(By.xpath('//*[@id="addApiForm"]/button')).click();
    }
}

module.exports = AddAPIBackend;