const puppeteer = require("puppeteer");

async function getScrapedData(website) {
  /**
   * Set headless to true for @production use
   */
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = website || "https://ayushsoni1010.com/";

  try {
    await page.goto(url);

    /**
     * @screenshot of the portfolio website
     */
    // await page.screenshot({ path: "mywebsite.png" });

    /**
     * @set viewport
     */
    await page.setViewport({
      width: 1400,
      height: 800,
    });

    /**
     * @get the pages HTML content
     */
    const pageContent = await page.content();

    /**
     * @data Handling
     */
    const [innerText, linkedin, github, twitter, instagram, resume, other] =
      await Promise.all([
        page
          .$eval("*", (item) => item.innerText)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        page
          .$eval('a[href*="linkedin.com"]', (item) => item?.href)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        page
          .$eval('a[href*="github.com"]', (item) => item?.href)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        ,
        page
          .$eval('a[href*="twitter.com"]', (item) => item?.href)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        ,
        page
          .$eval('a[href*="instagram.com"]', (item) => item?.href)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        ,
        page
          .$eval('a[href*="resume"]', (item) => item?.href)
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        ,
        page
          .$$eval('a[href^="http"]', (item) => item.map((link) => link.href))
          .catch((error) => {
            console.error("Error: ", error);
            return "";
          }),
        ,
      ]);

    /**
     * @extract potential locations using regular expressions
     */
    const locationRegex = /Location: (.+)/i;
    const location = pageContent.match(locationRegex);

    /**
     * @extract potential names using regular expressions
     */
    const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/g;
    const names = pageContent.match(nameRegex);

    /**
     * @extract potential emails using regular expressions
     */
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    const emails = pageContent.match(emailRegex);

    /**
     * @extract potential numbers using regular expressions
     */
    const numberRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const mobileNumbers = pageContent.match(numberRegex);

    const portfolioData = {
      site: url,
      name: names || [],
      email: emails || [],
      mobile: mobileNumbers || [],
      location: location,
      links: {
        linkedin: linkedin || "https://linkedin.com/",
        github: github || "https://github.com/",
        twitter: twitter || "https://twitter.com/",
        instagram: instagram || "https://instagram.com/",
        resume: resume || "",
        other: other || [],
      },
      text: innerText,
    };

    /**
     * @log and @format JSON object
     */
    // console.log(JSON.stringify(portfolioData, null, 2));
    // console.log(portfolioData);
    return portfolioData;
  } catch (error) {
    /**
     * @error Handling
     */
    console.error("Error occurred:", error);
  } finally {
    /**
     * @close connection
     */
    await browser.close();
  }
}

module.exports = { getScrapedData };