# Embedded systems and hardware design projects by Lázár Sándor
## [Projects](Projects/index.md)

<div class="project-carousel">
  <div class="project-track">

    <!-- Original set -->

    <a href="/Projects/BreadboardPSU/" class="project-card">
      <img src="../assets/breadboardpsu-card.png" alt="BreadboardPSU">
      <h3>BreadboardPSU</h3>
      <p>Solderless breadboard compatible PSU</p>
    </a>

    <a href="/Projects/AIOduino" class="project-card">
      <img src="../assets/aioduino-card.png" alt="AIODuino">
      <h3>AIODuino</h3>
      <p>ATmega1284P Dev board with peripherals</p>
    </a>

    <a href="/Projects/NANOPSU" class="project-card">
      <img src="../assets/nanopsu-card.png" alt="NanoPSU">
      <h3>NanoPSU</h3>
      <p>BLE enabled Programmable PSU</p>
    </a>

    <a href="/Projects/Launchy" class="project-card">
      <img src="../assets/launchy-card.png" alt="Launchy">
      <h3>Launchy</h3>
      <p>ESP-NOW based model rocket launch controller</p>
    </a>

    <a href="/Projects/Sparky" class="project-card">
      <img src="../assets/Sparky-card.png" alt="Sparky">
      <h3>Sparky</h3>
      <p>???</p>
    </a>

    <a href="/Projects/TinyPSU" class="project-card">
      <img src="../assets/TinyPSU-card.png" alt="TinyPSU">
      <h3>TinyPSU</h3>
      <p>Small form factor CV/CC benchtop power supply</p>
    </a>

    <a href="/Projects/USB3hub" class="project-card">
      <img src="../assets/USB3HUB-card.png" alt="Usb3.0 Hub">
      <h3>USB3.0 Hub</h3>
      <p>USB-C IN 2xUSB-C 3.0, 2xUSB-A 3.0 OUT</p>
    </a>

    <a href="/Projects/electronic_load" class="project-card">
      <img src="../assets/Eload-card.png" alt="Electronic Load">
      <h3>Electronic Load</h3>
      <p>Adjustable Water Cooled Electronic Load</p>
    </a>


    <!-- Duplicate set for seamless loop -->
    <a href="/Projects/BreadboardPSU/" class="project-card">
      <img src="../assets/breadboardpsu-card.png" alt="BreadboardPSU">
      <h3>BreadboardPSU</h3>
      <p>Solderless breadboard compatible PSU</p>
    </a>

    <a href="/Projects/AIOduino" class="project-card">
      <img src="../assets/aioduino-card.png" alt="AIODuino">
      <h3>AIODuino</h3>
      <p>ATmega1284P Dev board with peripherals</p>
    </a>

    <a href="/Projects/NANOPSU" class="project-card">
      <img src="../assets/nanopsu-card.png" alt="NanoPSU">
      <h3>NanoPSU</h3>
      <p>BLE enabled Programmable PSU</p>
    </a>

    <a href="/Projects/Launchy" class="project-card">
      <img src="../assets/launchy-card.png" alt="Launchy">
      <h3>Launchy</h3>
      <p>ESP-NOW based model rocket launch controller</p>
    </a>

    <a href="/Projects/Sparky" class="project-card">
      <img src="../assets/Sparky-card.png" alt="Sparky">
      <h3>Sparky</h3>
      <p>???</p>
    </a>

    <a href="/Projects/TinyPSU" class="project-card">
      <img src="../assets/TinyPSU-card.png" alt="TinyPSU">
      <h3>TinyPSU</h3>
      <p>Small form factor CV/CC benchtop power supply</p>
    </a>

    <a href="/Projects/USB3hub" class="project-card">
      <img src="../assets/USB3HUB-card.png" alt="Usb3.0 Hub">
      <h3>USB3.0 Hub</h3>
      <p>USB-C IN 2xUSB-C 3.0, 2xUSB-A 3.0 OUT</p>
    </a>

    <a href="/Projects/electronic_load" class="project-card">
      <img src="../assets/Eload-card.png" alt="Electronic Load">
      <h3>Electronic Load</h3>
      <p>Adjustable Water Cooled Electronic Load</p>
    </a>

  </div>
</div>


## [Gallery](Gallery.md)

<div id="random-gallery-image"></div>

``` js title="randomGallery.js" linenums="1"
let galleryInterval;   // global outside subscribe
let lastIndex = -1;    // track last shown image index

document$.subscribe(function() {
  const container = document.getElementById("random-gallery-image");
  if (!container) return;

  const images = [
    "/assets/Gallery/Launchy/Launchy-accessories.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter-open.jpg"
  ];

  // --- Utility: make filenames look nice
  function formatFileName(path) {
    let name = path.split("/").pop();
    name = name.replace(/\.[^/.]+$/, ""); // remove extension
    name = name.replace(/[-_]/g, " ");    // replace - and _ with spaces
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function showRandomImage() {
    // pick a new index that's not the same as the last one
    let index;
    do {
      index = Math.floor(Math.random() * images.length);
    } while (index === lastIndex && images.length > 1);
    lastIndex = index;

    const randomImage = images[index];
    const fileName = formatFileName(randomImage);

    // first run → build DOM structure
    if (!container.querySelector("img")) {
      container.innerHTML = `
        <div style="text-align:center; max-width:800px; margin:auto;">
          <a href="/Gallery/" id="gallery-link" style="display:block;">
            <img id="gallery-img" src="${randomImage}" alt="${fileName}"
                 style="max-width:100%; max-height:400px; object-fit:contain;
                        border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.15);
                        opacity:1; transition:opacity 0.8s ease;">
          </a>
          <p id="gallery-caption"
             style="margin-top:0.5rem; font-size:0.9rem; color:var(--md-default-fg-color--light)">
            ${fileName}
          </p>
        </div>`;
      return;
    }

    // update existing elements
    const img = container.querySelector("#gallery-img");
    const caption = container.querySelector("#gallery-caption");

    // fade out
    img.style.opacity = 0;

    setTimeout(() => {
      img.src = randomImage;
      img.alt = fileName;
      caption.textContent = fileName;

      // fade in
      img.style.opacity = 1;
    }, 800); // match transition time
  }

  // Clear old interval if it exists
  if (galleryInterval) clearInterval(galleryInterval);

  // Show first image immediately
  showRandomImage();

  // Repeat every 5s
  galleryInterval = setInterval(showRandomImage, 5000);
});
```


## [Downloads](Downloads.md)

[AIOduino.zip](https://github.com/sanko0112/AIOduino/archive/refs/heads/main.zip) <br>
[NANOPSU.zip](https://github.com/sanko0112/NANOPSU/archive/refs/heads/main.zip) <br>
[BreadboardPSU](https://github.com/sanko0112/BreadboardPSU/archive/refs/heads/main.zip) <br>
[Launchy.zip](https://github.com/sanko0112/Launchy/archive/refs/heads/main.zip) <br>

## [Tags](Tags.md)

## [About](About.md)
