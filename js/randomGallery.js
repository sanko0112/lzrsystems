let galleryInterval;
let queue = [];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document$.subscribe(function () {
  const container = document.getElementById("random-gallery-image");
  if (!container) return;

  const images = [
    "/assets/Gallery/Launchy/Launchy-accessories.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter-open.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back-pcb.jpg",
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
    "/assets/Gallery/YABSPD/YABSPD-front-pcb.jpg",
    "/assets/Gallery/USB-HUB-PLUS/USB-Hub+-front.jpg",
    "/assets/Gallery/YABSPD/YABSPD-front.jpg",
    "/assets/Gallery/RF-Test-Board/RF-Test-Board-board-front.jpg",
    "/assets/Gallery/RF-Test-Board/RF-Test-Board-board-back.jpg",
    "/assets/Gallery/Business-card/LZR-Card-board-front.jpg",
    "/assets/Gallery/Business-card/LZR-Card-board-back.jpg",
    "/assets/Gallery/USB-PD-Trigger/PD-Trigger-board-front.jpg",
    "/assets/Gallery/USB-PD-Trigger/PD-Trigger-board-back.jpg",
    "/assets/Gallery/Omnifly-H7/omnifly-board-front.jpg",
    "/assets/Gallery/Omnifly-H7/omnifly-board-back.jpg",
    "/assets/Gallery/Telemetrium/Telemetrium-board-front.jpg",
    "/assets/Gallery/Telemetrium/Telemetrium-board-back.jpg",
  ];

  function formatFileName(path) {
    let name = path.split("/").pop();
    name = name.replace(/\.[^/.]+$/, "");
    name = name.replace(/[-_]/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function pickNextIndex() {
    if (queue.length === 0) {
      queue = shuffleArray([...Array(images.length).keys()]);
    }
    return queue.pop();
  }

  const FADE_MS = 600;

  function fadeOut(el) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FADE_MS,
      easing: "ease",
      fill: "forwards"
    }).finished;
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

    fadeOut(img).then(() => {
      const preload = new Image();

      preload.onload = () => {
        img.src           = src;
        img.alt           = caption;
        capEl.textContent = caption;
        fadeIn(img);
      };

      preload.onerror = () => {
        fadeIn(img);
      };

      preload.src = src;
    });
  }

  // Clear any interval left over from a previous page navigation
  if (galleryInterval) clearInterval(galleryInterval);

  showRandomImage();
  galleryInterval = setInterval(showRandomImage, 3000);
});