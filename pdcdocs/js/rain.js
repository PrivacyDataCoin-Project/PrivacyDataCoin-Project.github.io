(function () {
  const canvas = document.querySelector(".rain");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const glyphs = "01PDCabcdef".split("");
  let cols = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.ceil(width / 18);
    cols = Array.from({ length: count }, () => Math.random() * height);
  }

  function frame() {
    ctx.fillStyle = "rgba(5, 6, 13, 0.18)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "14px IBM Plex Mono, monospace";
    cols.forEach((y, i) => {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const x = i * 18;
      ctx.fillStyle = Math.random() > 0.92 ? "#e8fff4" : "#39ff88";
      ctx.fillText(ch, x, y);
      cols[i] = y > height && Math.random() > 0.975 ? 0 : y + 16;
    });
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  frame();
})();
