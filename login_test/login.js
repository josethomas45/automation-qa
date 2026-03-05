const { Builder, By, Key, until } = require("selenium-webdriver");

async function loginTest() {

    let driver = await new Builder().forBrowser("chrome").build();

    try {

        await driver.get("https://cse.lms.sjcetpalai.ac.in/login/index.php");

        let username = await driver.findElement(By.id("username"));

        let password = await driver.findElement(By.id("password"));

        await username.sendKeys("josethomas2026@cs.sjcetpalai.ac.in");
        await password.sendKeys("Sjcet@123#");

        let loginButton = await driver.findElement(By.id("loginbtn"));
        await loginButton.click();

        await driver.wait(until.urlContains("/my/"), 40000);

        console.log("Login Successful ✅");

    } catch (error) {

        console.log("Login Failed ❌");
        console.log(error);

    } finally {

        await driver.quit();

    }
}

loginTest();