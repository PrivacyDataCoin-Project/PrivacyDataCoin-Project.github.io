(function () {
  document.documentElement.setAttribute("data-theme", "brand");

  function fitHeadings() {
    if (window.matchMedia && window.matchMedia("(max-width: 640px)").matches) {
      document.querySelectorAll("h1, h2").forEach(function (el) {
        el.style.fontSize = "";
      });
      return;
    }
    document.querySelectorAll("h1, .section-head h2, .page-hero h1, main .wrap > h1").forEach(function (el) {
      el.style.fontSize = "";
      el.style.whiteSpace = "nowrap";
      var parent = el.parentElement;
      if (!parent) return;
      var maxPx = parseFloat(window.getComputedStyle(el).fontSize) || 40;
      var minPx = el.tagName === "H1" ? 22 : 18;
      var size = maxPx;
      // binary-ish shrink until fits
      var guard = 0;
      while (el.scrollWidth > parent.clientWidth && size > minPx && guard < 80) {
        size -= 0.5;
        el.style.fontSize = size + "px";
        guard += 1;
      }
    });
  }
  fitHeadings();
  window.addEventListener("resize", function () {
    clearTimeout(window._pdcFitHeadings);
    window._pdcFitHeadings = setTimeout(fitHeadings, 120);
  });

  try { localStorage.removeItem("pdc-redesign-theme"); } catch (e) {}

  var menuBtn = document.querySelector("[data-menu]");
  var panel = document.querySelector("[data-mobile]");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderLayers() {
    var host = document.querySelector("[data-layers]");
    var layers = window.PDC_LAYERS;
    if (!host || !layers) return;
    var current = host.dataset.current || layers[0].id;
    host.dataset.current = current;
    host.innerHTML = layers.map(function (layer) {
      var pressed = layer.id === current ? "true" : "false";
      return (
        '<button class="layer" type="button" data-layer="' + escapeHtml(layer.id) + '" aria-pressed="' + pressed + '">' +
          "<small>" + escapeHtml(layer.n) + " · " + escapeHtml(layer.hides) + "</small>" +
          "<strong>" + escapeHtml(layer.name) + "</strong>" +
        "</button>"
      );
    }).join("");
    var layer = layers.find(function (item) { return item.id === current; }) || layers[0];
    var title = document.querySelector("[data-layer-title]");
    var body = document.querySelector("[data-layer-body]");
    var meta = document.querySelector("[data-layer-meta]");
    if (title) title.textContent = layer.title;
    if (body) body.textContent = layer.body;
    if (meta) {
      meta.innerHTML = layer.meta.map(function (pair) {
        return "<dt>" + escapeHtml(pair[0]) + "</dt><dd>" + escapeHtml(pair[1]) + "</dd>";
      }).join("");
    }
    document.querySelectorAll(".slip .field").forEach(function (field) {
      field.classList.toggle("sealed", layer.seal.indexOf(field.dataset.field) !== -1);
    });
  }

  document.addEventListener("click", function (event) {
    var layerBtn = event.target.closest("[data-layer]");
    if (!layerBtn) return;
    var host = document.querySelector("[data-layers]");
    if (!host) return;
    host.dataset.current = layerBtn.dataset.layer;
    renderLayers();
  });

  renderLayers();

  window.PDC_USE_RELEASE = function (info) {
    var notes = document.querySelector("[data-release-notes]");
    if (notes && info && info.tag) {
      notes.textContent = "Latest release " + info.tag + (info.date ? " · " + info.date : "") + ".";
    }
  };

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MATRIX_CHARS = "0123456789ABCDEF01アイウエオカキクケコ▓░█#@$%&*";

  function matrixReveal(el, finalText, options) {
    if (!el) return;
    var text = String(finalText == null ? "" : finalText);
    if (!text) return;
    if (reduceMotion) {
      el.textContent = text;
      el.classList.remove("is-decoding");
      return;
    }
    var opts = options || {};
    var duration = opts.duration || 900 + Math.floor(Math.random() * 500);
    var started = performance.now();
    var len = text.length;
    el.classList.add("is-decoding");
    if (el._matrixFrame) cancelAnimationFrame(el._matrixFrame);

    function frame(now) {
      var t = Math.min(1, (now - started) / duration);
      var reveal = Math.floor(t * len);
      var out = "";
      for (var i = 0; i < len; i++) {
        var ch = text.charAt(i);
        if (ch === " " || ch === "," || ch === ".") {
          out += ch;
        } else if (i < reveal) {
          out += ch;
        } else {
          out += MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
        }
      }
      el.textContent = out;
      if (t < 1) {
        el._matrixFrame = requestAnimationFrame(frame);
      } else {
        el.textContent = text;
        el.classList.remove("is-decoding");
        el._matrixFrame = null;
      }
    }
    el._matrixFrame = requestAnimationFrame(frame);
  }

  // Static / HUD values decode on load (staggered Matrix reveal)
  document.querySelectorAll("[data-matrix][data-matrix-final]").forEach(function (el, i) {
    el.textContent = "—";
    setTimeout(function () {
      matrixReveal(el, el.getAttribute("data-matrix-final"), {
        duration: 700 + Math.floor(Math.random() * 500)
      });
    }, 80 + i * 70);
  });

  var heightEl = document.querySelector("[data-height]");
  var peersEl = document.querySelector("[data-peers]");
  var aliasesEl = document.querySelector("[data-aliases]");
  if (heightEl || peersEl) {
    fetch("https://explorer.privacydatacoin.com/api/get_info")
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (info) {
        if (heightEl && info.height != null) {
          matrixReveal(heightEl, Number(info.height).toLocaleString("en-US"), { duration: 1100 });
        }
        if (peersEl) {
          var n = (info.incoming_connections_count || 0) + (info.outgoing_connections_count || 0);
          matrixReveal(peersEl, String(n), { duration: 850 });
        }
        if (aliasesEl && info.alias_count != null) {
          matrixReveal(aliasesEl, String(info.alias_count), { duration: 900 });
        }
      })
      .catch(function () {});
  }
})();
