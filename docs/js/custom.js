document.documentElement.style.scrollBehavior = "smooth";

// Optional: custom scroll step
window.addEventListener("wheel", function(event) {
  if (event.ctrlKey) return; // allow zoom with Ctrl+Scroll
  event.preventDefault();
  window.scrollBy({
    top: event.deltaY < 0 ? -500 : 500, // 100px per step
    left: 0,
    behavior: "smooth"
  });
}, { passive: false });