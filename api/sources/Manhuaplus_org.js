import puppeteer from "puppeteer";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import firebaseConfig from "../firebase.config.js";
import { autoScroll } from "../functions.js";

// Initialize the firebase app
const fb = initializeApp(firebaseConfig);
const fs = getFirestore(fb);

// Gets all the mangas from the Manhuaplus website
export async function get_Manhuaplus_org() {
  // Launch a new browser
  const browser = await puppeteer.launch({
    headless: "new",
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
    await autoScroll(page, 1000);

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

        // Update the document ID
        const id = title.trim().toLowerCase().replace(/[\.+\!+\?+\'+\:+\,+\;+\++\~+\’+]/g, "").replace(/[\s+]/g, "-");

        data[id] = {title, href, img};
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
  for (const [id, data] of Object.entries(mh)) {
    const mhdoc = doc(fs, `sources/website/manhuaplus.org/${id}`);
    const exists = await getDoc(mhdoc);
    if (!exists.exists()) {
      // If the manhua does not exist, add it to the list
      console.log(`Title does not exist: ${id}...`);
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
        chapterData.forEach((el) => chapters.push(el.querySelector("a").innerHTML.trim().replace("Chapter ", "")));

        return { genres, description, chapters };
      });

      // Add the manhua to the list
      setDoc(doc(fs, `sources/website/manhuaplus.org/${id}`), {
          name: data.title,
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

// Checks if there exists an a previous or next chapter
export function prev_next_Manhuaplus_org() {

}

// Extracts the imgs from the page
export async function extract_Manhuaplus_org(manhua, chapter) {
  // Get the manhua data
  const mh = doc(fs, `sources/website/manhuaplus.org/${manhua}`);
  const mhSnap = await getDoc(mh);
  const url = mhSnap.data().url;

  // Get the chapter site
  const chapterParam = chapter.replace(".", "-");
  const ch = `${url}/chapter-${chapterParam}`;

  // Launch a new browser
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // Get the images
  await page.goto(ch, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("img.lazy.loaded");
  await autoScroll(page, 10000);

  // Get the images
  const imgs = await page.evaluate(() => {
    let data = [];
    Array.from(document.querySelectorAll("img.lazy.loaded")).forEach((el) => data.push(el.src));
    return data;
  });

  // Close the browser
  await browser.close();

  // Return the images
  return imgs;
}