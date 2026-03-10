const { Builder, By, until } = require('selenium-webdriver');

async function loginTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the login page
        await driver.get('https://the-internet.herokuapp.com/login');
        await driver.manage().window().maximize();

        // Wait for the username field and enter credentials
        await driver.wait(until.elementLocated(By.css('#username')), 5000);
        await driver.findElement(By.css('#username')).sendKeys('tomsmith');
        await driver.findElement(By.css('#password')).sendKeys('SuperSecretPassword!');

        // Click the login button
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for success message
        await driver.wait(until.elementLocated(By.css('.flash.success')), 5000);
        const message = await driver.findElement(By.css('.flash.success')).getText();
        console.log('Login successful! Message:', message.trim());

        await driver.sleep(3000);
    } catch (err) {
        console.error('Login failed:', err.message);
    } finally {
        await driver.quit();
    }
}

loginTest();
