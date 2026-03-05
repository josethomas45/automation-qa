const { Builder, By, Key } = require('selenium-webdriver');

async function example() {

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.google.com');

        let searchBox = await driver.findElement(By.name('q'));

        await searchBox.sendKeys('SJCET Pala');

        await searchBox.sendKeys(Key.RETURN);

        await driver.sleep(5000);

    } finally {

        await driver.quit();

    }
}

example();