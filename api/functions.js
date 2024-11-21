// Scroll to bottom of page
export async function autoScroll(page, dist) {
  await page.evaluate(async (dist) => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = dist;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight - window.innerHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  }, dist);
}