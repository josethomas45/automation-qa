const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function loginTest() {

    let options = new chrome.Options();
    options.addArguments("--incognito");

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {

        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.manage().window().maximize();

        await driver.wait(until.elementLocated(By.id('username')), 5000);
        await driver.findElement(By.id('username')).sendKeys('tomsmith');

        await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword');

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for the page to respond after submit
        await driver.sleep(2000);

        // Check if login was successful
        try {
            const successMessage = await driver.findElement({ css: '.flash.success' });
            console.log('Successfully logged in');
            const successScreenshot = await driver.takeScreenshot();
            fs.writeFileSync('screenshot_success.png', successScreenshot, 'base64');
            console.log('Screenshot saved: screenshot_success.png');
        } catch (error) {
            console.error('Login failed');
            const failureScreenshot = await driver.takeScreenshot();
            fs.writeFileSync('screenshot_failure.png', failureScreenshot, 'base64');
            console.log('Screenshot saved: screenshot_failure.png');
        }


    } catch (err) {
        console.error("Test failed:", err);
    }

    //await driver.quit();
}

loginTest();