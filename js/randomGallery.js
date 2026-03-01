let galleryInterval;
let lastIndex = -1;

document$.subscribe(function () {
  const container = document.getElementById("random-gallery-image");
  if (!container) return;

  const images = [
    "/assets/Gallery/Launchy/Launchy-accessories.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter-open.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back-pcb-old.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back-pcb.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front-pcb-old.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front-pcb.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front.jpg",
    "/assets/Gallery/BreadboardPSU/BreadboardPSU-front.jpg",
    "/assets/Gallery/FS-Sensor-board/FS-Sensor-board-back-pcb.jpg",
    "/assets/Gallery/FS-Sensor-board/FS-Sensor-board-front-pcb.jpg",
    "/assets/Gallery/NANOPSU/NanoPSU-front.jpg",
    "/assets/Gallery/NANOPSU/NanoPSU-back.jpg",
    "/assets/Gallery/TeamRadio/TeamRadio-back-pcb.jpg",
    "/assets/Gallery/TeamRadio/TeamRadio-front-pcb.jpg",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-back-pcb.jpg",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-front-pcb.jpg",
    "/assets/Gallery/YABSPD/YABSPD-back-pcb.jpg",
    "/assets/Gallery/YABSPD/YABSPD-front-pcb.jpg"
  ];

  function formatFileName(path) {
    let name = path.split("/").pop();
    name = name.replace(/\.[^/.]+$/, "");
    name = name.replace(/[-_]/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function pickNextIndex() {
    let index;
    do {
      index = Math.floor(Math.random() * images.length);
    } while (index === lastIndex && images.length > 1);
    return index;
  }

  const FADE_MS = 600; // duration of each fade in milliseconds

  function fadeOut(el) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FADE_MS,
      easing: "ease",
      fill: "forwards"   // hold opacity:0 after animation ends
    }).finished;         // returns a Promise that resolves when done
  }

  function fadeIn(el) {
    return el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: FADE_MS,
      easing: "ease",
      fill: "forwards"
    }).finished;
  }

  function showRandomImage() {
    const index   = pickNextIndex();
    lastIndex     = index;
    const src     = images[index];
    const caption = formatFileName(src);

    // ── First run: build the DOM ──────────────────────────────────────────
    if (!container.querySelector("img")) {
      container.innerHTML = `
        <div style="text-align:center; max-width:800px; margin:auto;">
          <a href="/Gallery/" id="gallery-link" style="display:block;">
            <img id="gallery-img"
                 src="${src}"
                 alt="${caption}"
                 style="opacity:0;">
          </a>
          <p id="gallery-caption">${caption}</p>
        </div>`;

      const firstImg = container.querySelector("#gallery-img");

      const revealFirst = () => {
        fadeIn(firstImg);
        firstImg.onload = null;
      };

      firstImg.onload = revealFirst;
      if (firstImg.complete) revealFirst();
      return;
    }

    // ── Subsequent runs: fade out → preload → swap → fade in ─────────────
    const img   = container.querySelector("#gallery-img");
    const capEl = container.querySelector("#gallery-caption");

    // 1. Fade out, wait for it to finish
    fadeOut(img).then(() => {

      // 2. Preload next image while screen is black
      const preload = new Image();

      preload.onload = () => {
        // 3. Swap content
        img.src           = src;
        img.alt           = caption;
        capEl.textContent = caption;

        // 4. Fade in
        fadeIn(img);
      };

      preload.onerror = () => {
        fadeIn(img); // fade back in even if image 404s
      };

      preload.src = src;
    });
  }

  // Clear any interval left over from a previous page navigation
  if (galleryInterval) clearInterval(galleryInterval);

  showRandomImage();
  galleryInterval = setInterval(showRandomImage, 3000);
});