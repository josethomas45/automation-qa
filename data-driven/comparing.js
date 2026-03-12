const fs = require('fs');
const { Builder, By } = require('selenium-webdriver');

// ─────────────────────────────────────────
// STEP 1: Read stored data from CSV file
// ─────────────────────────────────────────
function loadCSV(filePath) {
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const storedData = [];

    for (let i = 1; i < lines.length; i++) { // skip header row
        const line = lines[i].trim();
        if (!line) continue;

        // Split only on the LAST comma (in case title contains commas)
        const lastComma = line.lastIndexOf(',');
        const title = line.substring(0, lastComma).replace(/^"|"$/g, '').trim();
        const price = line.substring(lastComma + 1).trim();

        storedData.push({ title, price });
    }

    return storedData;
}

// ─────────────────────────────────────────
// STEP 2: Scrape live data from website
// ─────────────────────────────────────────
async function scrapeLiveData(driver) {
    const liveData = [];

    for (let page = 1; page <= 2; page++) {
        console.log(`\n🌐 Scraping Page ${page}...`);
        await driver.sleep(2000);

        const books = await driver.findElements(By.css('article.product_pod'));

        for (let book of books) {
            const titleElement = await book.findElement(By.css('h3 > a'));
            const title = await titleElement.getAttribute('title');

            const priceElement = await book.findElement(By.css('p.price_color'));
            const price = await priceElement.getText();

            liveData.push({ title, price });
        }

        // Go to next page (if not on last page)
        if (page < 2) {
            const nextButton = await driver.findElement(By.css('li.next > a'));
            await nextButton.click();
        }
    }

    return liveData;
}

// ─────────────────────────────────────────
// STEP 3: Compare stored vs live prices
// ─────────────────────────────────────────
function comparePrices(storedData, liveData) {
    const report = [];

    for (let stored of storedData) {
        const live = liveData.find(b => b.title === stored.title);

        if (!live) {
            report.push({
                title: stored.title,
                storedPrice: stored.price,
                livePrice: 'NOT FOUND',
                status: '❌ Missing on site'
            });
        } else if (live.price !== stored.price) {
            report.push({
                title: stored.title,
                storedPrice: stored.price,
                livePrice: live.price,
                status: '⚠️  Price Changed'
            });
        } else {
            report.push({
                title: stored.title,
                storedPrice: stored.price,
                livePrice: live.price,
                status: '✅ Match'
            });
        }
    }

    return report;
}

// ─────────────────────────────────────────
// STEP 4: Generate and save the report
// ─────────────────────────────────────────
function generateReport(report) {
    console.log('\n========================================');
    console.log('           📊 PRICE COMPARISON REPORT         ');
    console.log('========================================\n');

    let matched = 0, changed = 0, missing = 0;

    for (let entry of report) {
        console.log(`📖 ${entry.title}`);
        console.log(`   Stored: ${entry.storedPrice} | Live: ${entry.livePrice} | ${entry.status}`);
        console.log('');

        if (entry.status.includes('Match'))   matched++;
        if (entry.status.includes('Changed')) changed++;
        if (entry.status.includes('Missing')) missing++;
    }

    console.log('========================================');
    console.log(`✅ Matched   : ${matched}`);
    console.log(`⚠️  Changed  : ${changed}`);
    console.log(`❌ Missing   : ${missing}`);
    console.log(`📦 Total     : ${report.length}`);
    console.log('========================================\n');

    // Save report to CSV
    let csv = 'Title,Stored Price,Live Price,Status\n';
    for (let entry of report) {
        csv += `"${entry.title}",${entry.storedPrice},${entry.livePrice},${entry.status}\n`;
    }
    fs.writeFileSync('comparison_report.csv', csv);
    console.log('📁 Report saved to comparison_report.csv');
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
(async function main() {
    console.log('📂 Loading stored CSV data...');
    const storedData = loadCSV('books.csv');
    console.log(`✅ Loaded ${storedData.length} books from CSV.`);

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://books.toscrape.com/');

        const liveData = await scrapeLiveData(driver);
        console.log(`\n✅ Scraped ${liveData.length} books from the site.`);

        const report = comparePrices(storedData, liveData);
        generateReport(report);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await driver.quit();
    }
})();
