const { Builder, By, Key, until } = require("selenium-webdriver");

async function loginTest() {

    let driver = await new Builder().forBrowser("chrome").build();

    try {

        // 1️⃣ Open website
        await driver.get("https://cse.lms.sjcetpalai.ac.in/login/index.php");

        // 2️⃣ Find username field
        let username = await driver.findElement(By.id("username"));

        // 3️⃣ Find password field
        let password = await driver.findElement(By.id("password"));

        // 4️⃣ Enter login details
        await username.sendKeys("testuser");
        await password.sendKeys("123456");

        // 5️⃣ Click login button
        let loginButton = await driver.findElement(By.id("login"));
        await loginButton.click();

        // 6️⃣ Wait until dashboard loads
        await driver.wait(until.urlContains("dashboard"), 5000);

        console.log("Login Successful ✅");

    } catch (error) {

        console.log("Login Failed ❌");
        console.log(error);

    } finally {

        await driver.quit();

    }
}

loginTest();