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

  function showRandomImage() {
    const index     = pickNextIndex();
    lastIndex       = index;
    const src       = images[index];
    const caption   = formatFileName(src);

    // ── First run: build the DOM ──────────────────────────────────────────
    if (!container.querySelector("img")) {
      container.innerHTML = `
        <div style="text-align:center; max-width:800px; margin:auto;">
          <a href="/Gallery/" id="gallery-link" style="display:block;">
            <img id="gallery-img"
                 class="hidden"
                 src="${src}"
                 alt="${caption}">
          </a>
          <p id="gallery-caption">${caption}</p>
        </div>`;

      const firstImg = container.querySelector("#gallery-img");

      const revealFirst = () => {
        firstImg.classList.remove("hidden");  // triggers CSS fade-in
        firstImg.onload = null;
      };

      firstImg.onload = revealFirst;
      // Image may already be cached — onload won't fire in that case
      if (firstImg.complete) revealFirst();
      return;
    }

    // ── Subsequent runs: crossfade to next image ──────────────────────────
    const img   = container.querySelector("#gallery-img");
    const capEl = container.querySelector("#gallery-caption");

    // 1. Fade out — add .hidden class, CSS transition handles the animation
    img.classList.add("hidden");

    // 2. Wait for fade-out to finish, then preload the new image
    setTimeout(() => {
      const preload = new Image();

      // 3. Swap src and fade in only once the new image is fully loaded
      preload.onload = () => {
        img.src           = src;
        img.alt           = caption;
        capEl.textContent = caption;
        img.classList.remove("hidden");  // triggers CSS fade-in
      };

      preload.onerror = () => {
        capEl.textContent = "";
      };

      preload.src = src;
    }, 800); // must match transition duration in extra.css
  }

  // Clear any interval left over from a previous page navigation
  if (galleryInterval) clearInterval(galleryInterval);

  showRandomImage();
  galleryInterval = setInterval(showRandomImage, 5000);
});