const fs = require('fs');
const { Builder, By } = require('selenium-webdriver');

(async function scrapeBooks() {

    // Initialize WebDriver for Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        // Open the website
        await driver.get('http://books.toscrape.com/');

        // Arrays to store titles and prices
        let titles = [];
        let prices = [];

        // Loop through the first two pages
        for (let page = 1; page <= 2; page++) {

            // Wait for the page to load
            await driver.sleep(2000);

            // Find all the book elements on the current page
            let books = await driver.findElements(By.css('article.product_pod'));

            // Extract title and price from each book
            for (let book of books) {
                let titleElement = await book.findElement(By.css('h3 > a'));
                let title = await titleElement.getAttribute('title');

                let priceElement = await book.findElement(By.css('p.price_color'));
                let price = await priceElement.getText();

                titles.push(title);
                prices.push(price);
            }

            // Click "next" button to go to the next page (only if not on the last page)
            if (page < 2) {
                let nextButton = await driver.findElement(By.css('li.next > a'));
                await nextButton.click();
            }
        }

        // Print the results to the console
        for (let i = 0; i < titles.length; i++) {
            console.log(`Title: ${titles[i]}, Price: ${prices[i]}`);
        }

        // Build CSV content and save it to a file
        let csvContent = 'Title,Price\n';
        for (let i = 0; i < titles.length; i++) {
            csvContent += `${titles[i]},${prices[i]}\n`;
        }

        fs.writeFileSync('books.csv', csvContent);
        console.log('Scraping completed. Data saved to books.csv');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await driver.quit();
    }

})();
