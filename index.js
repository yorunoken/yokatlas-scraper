const { Database } = require("sqlite3").verbose();
const { chromium } = require("playwright");

async function scrapeTYT(context) {
    const db = new Database("data.db");

    const page = await context.newPage();
    const url =
        "https://yokatlas.yok.gov.tr/tercih-sihirbazi-t3-tablo.php?p=tyt";
    await page.goto(url);

    const insertStmt = db.prepare(`
            INSERT INTO tytData (
                yopCode,
                universityName,
                faculty,
                className,
                educationDuration,
                city,
                universityStyle,
                scholarshipRate,
                educationStyle,
                studentQuota2024,
                studentQuota2023,
                studentStatus2024,
                studentStatus2023,
                baseScore2024,
                baseScore2023,
                tbs2024,
                tbs2023
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    let index = 1;
    while (true) {
        console.log("page " + index);

        const rows = await page.$$("#mydata > tbody > tr");

        if (rows.length === 0) {
            await page.screenshot({ path: "error.png" });
            console.error("Couldn't find info table!");
            break;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const innerText = await row.innerText();
            const textArray = innerText
                .split(/\n|\t/)
                .map((text) => text.trim())
                .filter((text) => text !== "" && text !== "Listeme Ekle")
                .map((text) => text.replace(/\./g, "").replace(/\,/g, "."));

            const [
                yopCode,
                universityName,
                faculty,
                className,
                educationTime,
                city,
                universityStyle,
                scholarshipRate,
                educationStyle,
                studentQuota2024,
                studentQuota2023,
                studentStatus2024,
                studentStatus2023,
                baseScore2024,
                baseScore2023,
                tbs2024,
                tbs2023,
            ] = textArray;

            const rowObj = {
                yopCode,
                universityName,
                faculty,
                className,
                educationDuration: educationTime,
                city,
                universityStyle,
                scholarshipRate,
                educationStyle,
                studentQuota2024,
                studentQuota2023,
                studentStatus2024,
                studentStatus2023,
                baseScore2024: isNaN(Number(baseScore2024))
                    ? null
                    : Number(baseScore2024),
                baseScore2023: isNaN(Number(baseScore2023))
                    ? null
                    : Number(baseScore2023),
                tbs2024: isNaN(Number(tbs2024)) ? null : Number(tbs2024),
                tbs2023: isNaN(Number(tbs2023)) ? null : Number(tbs2023),
            };

            insertStmt.run(
                rowObj.yopCode,
                rowObj.universityName,
                rowObj.faculty,
                rowObj.className,
                rowObj.educationDuration,
                rowObj.city,
                rowObj.universityStyle,
                rowObj.scholarshipRate,
                rowObj.educationStyle,
                rowObj.studentQuota2024,
                rowObj.studentQuota2023,
                rowObj.studentStatus2024,
                rowObj.studentStatus2023,
                rowObj.baseScore2024,
                rowObj.baseScore2023,
                rowObj.tbs2024,
                rowObj.tbs2023,
            );
        }

        const nextButton = await page.$("#mydata_next");

        if (!nextButton || rows.length !== 50) {
            break; // no more pages
        }

        await nextButton.click();
        await page.waitForTimeout(1000);

        index++;
    }
}

async function scrapeAYT(context, type) {
    const db = new Database("data.db");

    const page = await context.newPage();
    const url =
        "https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=" + type;
    await page.goto(url);

    await page.waitForTimeout(500);

    const insertStmt = db.prepare(`
            INSERT INTO ${type}Data (
                    yopCode,
                    universityName,
                    faculty,
                    className,
                    educationDuration,
                    city,
                    universityStyle,
                    scholarshipRate,
                    educationStyle,
                    studentQuota2024,
                    studentQuota2023,
                    studentQuota2022,
                    studentQuota2021,
                    studentStatus2024,
                    studentStatus2023,
                    studentStatus2022,
                    studentStatus2021,
                    fullnessStatus,
                    enrolled2024,
                    enrolled2023,
                    enrolled2022,
                    enrolled2021,
                    tbs2024,
                    tbs2023,
                    tbs2022,
                    tbs2021,
                    baseScore2024,
                    baseScore2023,
                    baseScore2022,
                    baseScore2021
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    let index = 1;
    while (true) {
        console.log("page " + index);

        const rows = await page.$$("#mydata > tbody > tr");

        if (rows.length === 0) {
            await page.screenshot({ path: "error.png" });
            console.error("Couldn't find info table!");
            break;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const innerText = await row.innerText();
            const textArray = innerText
                .split(/\n|\t/)
                .map((text) => text.trim())
                .filter((text) => text !== "" && text !== "Listeme Ekle")
                .map((text) =>
                    text
                        .replace(/\./g, "")
                        .replace(/\,/g, ".")
                        .replace(/\#/g, ""),
                );

            const [
                yopCode,
                universityName,
                faculty,
                className,
                educationDuration,
                city,
                universityStyle,
                scholarshipRate,
                educationStyle,
                studentQuota2024,
                studentQuota2023,
                studentQuota2022,
                studentQuota2021,
                studentStatus2024,
                studentStatus2023,
                studentStatus2022,
                studentStatus2021,
                fullnessStatus,
                enrolled2024,
                enrolled2023,
                enrolled2022,
                enrolled2021,
                tbs2024,
                tbs2023,
                tbs2022,
                tbs2021,
                baseScore2024,
                baseScore2023,
                baseScore2022,
                baseScore2021,
            ] = textArray;

            const rowObj = {
                yopCode,
                universityName,
                faculty,
                className,
                educationDuration,
                city,
                universityStyle,
                scholarshipRate,
                educationStyle,
                studentQuota2024,
                studentQuota2023,
                studentQuota2022,
                studentQuota2021,
                studentStatus2024,
                studentStatus2023,
                studentStatus2022,
                studentStatus2021,
                fullnessStatus,
                enrolled2024: isNaN(Number(enrolled2024))
                    ? null
                    : Number(enrolled2024),
                enrolled2023: isNaN(Number(enrolled2023))
                    ? null
                    : Number(enrolled2023),
                enrolled2022: isNaN(Number(enrolled2022))
                    ? null
                    : Number(enrolled2022),
                enrolled2021: isNaN(Number(enrolled2021))
                    ? null
                    : Number(enrolled2021),
                tbs2024: isNaN(Number(tbs2024)) ? null : Number(tbs2024),
                tbs2023: isNaN(Number(tbs2023)) ? null : Number(tbs2023),
                tbs2022: isNaN(Number(tbs2022)) ? null : Number(tbs2022),
                tbs2021: isNaN(Number(tbs2021)) ? null : Number(tbs2021),
                baseScore2024: isNaN(Number(baseScore2024))
                    ? null
                    : Number(baseScore2024),
                baseScore2023: isNaN(Number(baseScore2023))
                    ? null
                    : Number(baseScore2023),
                baseScore2022: isNaN(Number(baseScore2022))
                    ? null
                    : Number(baseScore2022),
                baseScore2021: isNaN(Number(baseScore2021))
                    ? null
                    : Number(baseScore2021),
            };

            insertStmt.run(
                rowObj.yopCode,
                rowObj.universityName,
                rowObj.faculty,
                rowObj.className,
                rowObj.educationDuration,
                rowObj.city,
                rowObj.universityStyle,
                rowObj.scholarshipRate,
                rowObj.educationStyle,
                rowObj.studentQuota2024,
                rowObj.studentQuota2023,
                rowObj.studentQuota2022,
                rowObj.studentQuota2021,
                rowObj.studentStatus2024,
                rowObj.studentStatus2023,
                rowObj.studentStatus2022,
                rowObj.studentStatus2021,
                rowObj.fullnessStatus,
                rowObj.enrolled2024,
                rowObj.enrolled2023,
                rowObj.enrolled2022,
                rowObj.enrolled2021,
                rowObj.tbs2024,
                rowObj.tbs2023,
                rowObj.tbs2022,
                rowObj.tbs2021,
                rowObj.baseScore2024,
                rowObj.baseScore2023,
                rowObj.baseScore2022,
                rowObj.baseScore2021,
            );
        }

        const nextButton = await page.$("#mydata_next");

        if (!nextButton || rows.length !== 50) {
            break; // no more pages
        }

        await nextButton.click();
        await page.waitForTimeout(1000);

        index++;
    }
}

async function main() {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
    });

    console.log("scraping TYT");
    await scrapeTYT(context);
    console.log("scraping SAY");
    await scrapeAYT(context, "say");
    console.log("scraping SOZ");
    await scrapeAYT(context, "söz");
    console.log("scraping EA");
    await scrapeAYT(context, "ea");
    console.log("scraping DIL");
    await scrapeAYT(context, "dil");

    await context.close();
    await browser.close();
}
main();
