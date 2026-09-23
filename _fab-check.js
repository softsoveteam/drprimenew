const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto("http://localhost:3002/", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await page.waitForSelector(".dp-lp4", { timeout: 15000 });
  await page.$eval(".dp-fab-detail", (el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" })
  );
  await new Promise((r) => setTimeout(r, 1400));

  const info = await page.evaluate(() => {
    const pillow = document
      .querySelector(".dp-fab-pillow")
      .getBoundingClientRect();
    const stage = document
      .querySelector(".dp-fab-stage")
      .getBoundingClientRect();
    const dots = [1, 2, 3, 4].map((n) => {
      const p = document.querySelector(`.dp-lp${n}`);
      const d = p.querySelector(".dp-lp-dot").getBoundingClientRect();
      return {
        label: p.querySelector("h3").textContent.trim(),
        pctDownPillow: Math.round(
          ((d.top + d.height / 2 - pillow.top) / pillow.height) * 100
        ),
      };
    });
    return {
      stageH: Math.round(stage.height),
      pillowH: Math.round(pillow.height),
      spaceAbove: Math.round(pillow.top - stage.top),
      spaceBelow: Math.round(stage.bottom - pillow.bottom),
      dots,
      fourthBelowThird: dots[3].pctDownPillow > dots[2].pctDownPillow + 10,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({
    path: "C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-janvi/assets/fab-v18.png",
  });
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
