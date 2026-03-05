const { Builder, By, Key, until } = require("selenium-webdriver");

async function seleniumTest() {

    let driver = await new Builder().forBrowser("chrome").build();

    try {

        await driver.get("https://www.selenium.dev/selenium/web/web-form.html");

        let title = await driver.getTitle();
        console.log("Page title:", title);

        await driver.manage().setTimeouts({ implicit: 100000 });

        let textBox = await driver.findElement(By.name("my-text"));
        let submitButton = await driver.findElement(By.css("button"));

        await textBox.sendKeys("Hello Selenium!");
        await submitButton.click();

        let message = await driver.findElement(By.id("message"));
        let value = await message.getText();

        console.log("Message:", value);

    } finally {

        await driver.quit();

    }
}

seleniumTest();