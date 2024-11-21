import puppeteer from "puppeteer";

export async function get_Manhuaplus_org() {
  // Launch a new browser
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  let mh = {};
  let idx = 1;
  while(true) {
    await page.goto(`https://manhuaplus.org/filter/${idx}/?genres=&notGenres=&sex=All&chapter_count=0`, {
      waitUntil: "domcontentloaded",
    });

    // Get page data
    const manhuas = await page.evaluate(async () => {
      // Fetch the container with all the manhuas
      const container = document.querySelector("section.r2").querySelector("div.grid");
      if (!container) return {};

      // Get the manhuas
      const list = Array.from(container.children);
      let data = {};
      list.forEach((el) => {
        const href = el.querySelector("a.clamp").href;
        const title = el.querySelector("a.clamp").innerHTML.trim();
        data[title] = href;
      }); 

      return data;
    });

    // If page is empty, break the loop
    if (Object.keys(manhuas).length === 0) break;

    // Update the manhuas
    console.log("Updated page", idx);
    mh = {...mh, ...manhuas};
    idx++;

    // Fail safe
    if (idx > 20) break;
  }

  // Close the browser
  await browser.close();
  
  // console.log(mh);
  console.log("Done");
  return mh;
};