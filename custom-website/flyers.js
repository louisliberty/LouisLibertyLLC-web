/* Social flyers: scales each flyer to fit the screen and saves it as a PNG.
   To add a flyer, copy an <article class="flyer-card"> block in index.html
   and give its .flyer a new data-filename. */

const FLYER_WIDTH = 1080;
const FLYER_HEIGHT = 1350;

/* ---------- Fit each flyer to its on-screen box ---------- */
const stages = document.querySelectorAll(".flyer-stage");
const fit = (stage) => {
  stage.querySelector(".flyer").style.setProperty("--scale", stage.clientWidth / FLYER_WIDTH);
};
stages.forEach(fit);
if ("ResizeObserver" in window) {
  const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
  stages.forEach((s) => ro.observe(s));
} else {
  window.addEventListener("resize", () => stages.forEach(fit));
}

/* ---------- Shrink headlines that would run past the edges ---------- */
function fitText() {
  document.querySelectorAll(".fl-headline, .fl-tagline").forEach((el) => {
    el.style.fontSize = "";
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth && size > 24) {
      size -= 2;
      el.style.fontSize = size + "px";
    }
  });
}
fitText();
document.fonts.ready.then(fitText);

/* ---------- Render a flyer to a full-size PNG ---------- */
async function renderPng(flyer) {
  await document.fonts.ready;
  fitText();
  const options = {
    width: FLYER_WIDTH,
    height: FLYER_HEIGHT,
    canvasWidth: FLYER_WIDTH,
    canvasHeight: FLYER_HEIGHT,
    pixelRatio: 1,
    style: { transform: "none" }, // export at full size, not the on-screen scale
    cacheBust: true,
  };
  // The first pass lets Safari finish loading fonts and images; the second is the keeper.
  await window.htmlToImage.toPng(flyer, options);
  return window.htmlToImage.toPng(flyer, options);
}

document.querySelectorAll(".flyer-card").forEach((card) => {
  const flyer = card.querySelector(".flyer");
  const name = flyer.dataset.filename || "flyer.png";
  const downloadBtn = card.querySelector('[data-action="download"]');

  async function run(btn, label, action) {
    if (!window.htmlToImage) return alert("Still loading, try again in a moment.");
    btn.disabled = true;
    btn.textContent = "Creating image...";
    try {
      await action(await renderPng(flyer));
    } catch (err) {
      console.error(err);
      alert("Sorry, the image couldn't be created. Please try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  downloadBtn.addEventListener("click", () =>
    run(downloadBtn, "Download", (dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  );
});
