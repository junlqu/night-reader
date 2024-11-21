import puppeteer from "puppeteer";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import firebaseConfig from "../firebase.config.js";
import { autoScroll } from "../functions.js";

// Gets all the mangas from the Manhuaplus website
export async function get_Manhuaplus_org() {
  // Initialize the firebase app
  const fb = initializeApp(firebaseConfig);
  const fs = getFirestore(fb);

  // Launch a new browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  console.log("Opening browser...");
  const page = await browser.newPage();

  // Get the names and URLs of all manhuas
  console.log("Paging manhuaplus.org...");
  let mh = {};
  let idx = 1;
  while(true) {
    console.log(`Paging page ${idx}...`);
    await page.goto(`https://manhuaplus.org/filter/${idx}/?genres=&notGenres=&sex=All&chapter_count=0`, {
      waitUntil: "domcontentloaded",
    });
    await autoScroll(page);

    // Get page data
    const manhuas = await page.evaluate(async () => {
      // Fetch the container with all the manhuas
      const container = document.querySelector("section.r2").querySelector("div.grid");
      if (!container) return {};

      // Get the manhuas on the page
      let data = {};
      const list = Array.from(container.children);
      list.forEach(async (el) => {
        // Get the manhua details
        const href = el.querySelector("a.clamp").href;
        const title = el.querySelector("a.clamp").innerHTML.trim();
        const img = el.querySelector("img").src;

        data[title] = {href, img};
      });

      return data;
    });

    // If page is empty, break the loop
    if (Object.keys(manhuas).length === 0) break;

    // Update the manhuas
    mh = {...mh, ...manhuas};
    idx++;

    // Fail safe
    if (idx > 20) break;
  }

  // Check if the manhua exists
  console.log("Checking if manhuas exist...");
  for (const [title, data] of Object.entries(mh)) {
    const mhdoc = doc(fs, `sources/website/manhuaplus.org/${title}`);
    const exists = await getDoc(mhdoc);
    if (!exists.exists()) {
      // If the manhua does not exist, add it to the list
      console.log(`Title does not exist: ${title}...`);
      await page.goto(data.href, {
        waitUntil: "domcontentloaded",
      });

      // Get the manhua details
      const details = await page.evaluate(() => {
        // Get the manhua catgeories
        const categories = Array.from(document.querySelectorAll("a.label"));
        const genres = [];
        categories.forEach((el) => genres.push(el.innerHTML.trim()));

        // Get the manhua description
        const description = document.querySelector("#syn-target").innerHTML.trim();

        // Get the manhua chapters
        const chapterData = Array.from(document.querySelectorAll("li.chapter"));
        const chapters = [];
        chapterData.forEach((el) => chapters.push(el.querySelector("a").innerHTML.trim()));

        return { genres, description, chapters };
      });

      // Add the manhua to the list
      setDoc(doc(fs, `sources/website/manhuaplus.org/${title}`), {
          name: title,
          url: data.href,
          img: data.img,
          genres: details.genres,
          description: details.description,
          chapters: details.chapters,
        },
        { merge: true }
      );
    }
  };

  // Close the browser
  await browser.close();
  
  // console.log(mh);
  console.log("Done");
};