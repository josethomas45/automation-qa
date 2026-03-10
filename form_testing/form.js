const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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

        await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');

        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.elementLocated(By.css('.flash.success')), 5000);

        console.log("Login successful");

        // Wait for logout button
        let logoutBtn = await driver.wait(
            until.elementLocated(By.css('.button.secondary.radius')),
            5000
        );

        await driver.wait(until.elementIsVisible(logoutBtn), 5000);

        await logoutBtn.click();

        await driver.wait(until.urlContains('/login'), 5000);

        console.log("Logout successful");

    } catch (err) {
        console.error("Test failed:", err);
    }

    await driver.quit();
}

loginTest();