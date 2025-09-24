document$.subscribe(function() {
  // --- Utility: parse file names into captions
  function formatFileName(path) {
    let name = path.split("/").pop();
    name = name.replace(/\.[^/.]+$/, ""); // remove extension
    name = name.replace(/[-_]/g, " ");    // replace - and _ with spaces
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // --- Project image lists
  const launchy_images = [
    "/assets/Gallery/Launchy/launchy_logo.png",
    "/assets/Gallery/Launchy/Launchy-top.png",
    "/assets/Gallery/Launchy/Launchy-bottom.png",
    "/assets/Gallery/Launchy/Launchy-Transmitter.jpg",
    "/assets/Gallery/Launchy/Launchy-Transmitter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-igniter.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-battSide.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-ematchSide.jpg"
  ];

  // --- Render function (grid layout + lightbox)
  function renderGallery(containerId, images) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `<div style="
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 1rem;
    ">`;

    for (const img of images) {
      const caption = formatFileName(img);
      html += `
        <div style="text-align:center;">
          <a href="${img}" title="${caption}">
            <img src="${img}" alt="${caption}"
                 style="width:100%; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.15)">
          </a>
          <p style="margin-top:0.5rem; font-size:0.9rem; color:var(--md-default-fg-color--light)">
            ${caption}
          </p>
        </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  // --- Render each project separately
  renderGallery("launchy-gallery", launchy_images);
});
