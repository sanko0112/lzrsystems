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
    "/assets/Gallery/Launchy/Launchy-Igniter.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-open.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-battSide.jpg",
    "/assets/Gallery/Launchy/Launchy-Igniter-ematchSide.jpg"
  ];

  const aioduino_images = [
    "/assets/Gallery/AIOduino/AIOduino-logo.png",
    "/assets/Gallery/AIOduino/3D-Board-Front.png",
    "/assets/Gallery/AIOduino/3D-Board-Back.png",
    "/assets/Gallery/AIOduino/AIOduino-back-pcb-old.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back-pcb.jpg",
    "/assets/Gallery/AIOduino/AIOduino-back.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front-pcb-old.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front-pcb.jpg",
    "/assets/Gallery/AIOduino/AIOduino-front.jpg"
  ];

    const nanopsu_images = [
    "/assets/Gallery/NANOPSU/NANOPSU-logo.png",
    "/assets/Gallery/NANOPSU/3D-Board-Front.png",
    "/assets/Gallery/NANOPSU/3D-Board-Back.png",
    "/assets/Gallery/NANOPSU/NanoPSU-front.jpg",
    "/assets/Gallery/NANOPSU/NanoPSU-back.jpg"
  ];

    const breadboardpsu_images = [
    "/assets/Gallery/BreadboardPSU/BreadboardPSU-logo.png",
    "/assets/Gallery/BreadboardPSU/3D-Board-Front.png",
    "/assets/Gallery/BreadboardPSU/3D-Board-Back.png",
    "/assets/Gallery/BreadboardPSU/BreadboardPSU-front.jpg"
  ];

    const fs_sensor_board_images = [
    "/assets/Gallery/FS-Sensor-board/FS-Sensor-board-front-pcb.jpg",
    "/assets/Gallery/FS-Sensor-board/FS-Sensor-board-back-pcb.jpg"
  ];

    const omnifly_images = [
      "/assets/Gallery/Omnifly-H7/omnifly-logo.svg",
      "/assets/Gallery/Omnifly-H7/omnifly-front.png",
      "/assets/Gallery/Omnifly-H7/omnifly-back.png"
  ];

    const teamradio_images = [
    "/assets/Gallery/TeamRadio/TeamRadio-logo.svg",
    "/assets/Gallery/TeamRadio/TeamRadio-front-render.png",
    "/assets/Gallery/TeamRadio/TeamRadio-back-render.png",
    "/assets/Gallery/TeamRadio/TeamRadio-front-pcb.jpg",
    "/assets/Gallery/TeamRadio/TeamRadio-back-pcb.jpg"
  ];

    const telemetrium_images = [
      "/assets/Gallery/Telemetrium/telemetrium-logo.svg",
      "/assets/Gallery/Telemetrium/telemetrium-front.png",
      "/assets/Gallery/Telemetrium/telemetrium-back.png"
  ];

    const usb_hub_plus_images = [
    "/assets/Gallery/USB-HUB-PLUS/logo.svg",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-front-render.png",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-back-render.png",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-front-pcb.jpg",
    "/assets/Gallery/USB-HUB-PLUS/USBHub+-back-pcb.jpg"
  ];

    const yabspd_images = [
    "/assets/Gallery/YABSPD/YABSPD-logo.svg",
    "/assets/Gallery/YABSPD/YABSPD-front-render.png",
    "/assets/Gallery/YABSPD/YABSPD-back-render.png",
    "/assets/Gallery/YABSPD/YABSPD-front-pcb.jpg",
    "/assets/Gallery/YABSPD/YABSPD-back-pcb.jpg"
  ];

    const IR_Gate_images = [
    "/assets/Gallery/FS-IR-Gate/IR-Gate-logo.svg",
    "/assets/Gallery/FS-IR-Gate/IR-Gate-front-render.png",
    "/assets/Gallery/FS-IR-Gate/IR-Gate-back-render.png"
  ];

    const RF_test_board_images = [
    "/assets/Gallery/RF-Test-Board/RF-Board-logo.svg",
    "/assets/Gallery/RF-Test-Board/RF-Board-front-render.png",
    "/assets/Gallery/RF-Test-Board/RF-Board-back-render.png"
  ];

    const lzr_card_images = [
    "/assets/Gallery/Business-card/LZR-Card-logo.svg",
    "/assets/Gallery/Business-card/Business-card-front-render.png",
    "/assets/Gallery/Business-card/Business-card-back-render.png"
  ];
    const pd_trigger_images = [
    "/assets/Gallery/USB-PD-Trigger/PD-Trigger-logo.svg",
    "/assets/Gallery/USB-PD-Trigger/PD-Trigger-front-render.png",
    "/assets/Gallery/USB-PD-Trigger/PD-Trigger-back-render.png"
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
  renderGallery("Omnifly-gallery", omnifly_images);
  renderGallery("Telemetrium-gallery", telemetrium_images);
  renderGallery("USBHUBPlus-gallery", usb_hub_plus_images);
  renderGallery("YABSPD-gallery", yabspd_images);
  renderGallery("TeamRadio-gallery", teamradio_images);
  renderGallery("IR-Gate-gallery", IR_Gate_images);
  renderGallery("FS-Sensor-Board-gallery", fs_sensor_board_images);
  renderGallery("RF-Test-Board-gallery", RF_test_board_images);
  renderGallery("LZR-Card-gallery", lzr_card_images);
  renderGallery("PD-Trigger-gallery", pd_trigger_images);
  renderGallery("nanopsu-gallery", nanopsu_images);
  renderGallery("aioduino-gallery", aioduino_images);
  renderGallery("Launchy-gallery", launchy_images);
  renderGallery("Breadboardpsu-gallery", breadboardpsu_images);
});
