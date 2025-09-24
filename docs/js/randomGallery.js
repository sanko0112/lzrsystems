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
            <img id="gallery-img" src="${randomImage}" alt="${fileName}">
          </a>
          <p id="gallery-caption">${fileName}</p>
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
