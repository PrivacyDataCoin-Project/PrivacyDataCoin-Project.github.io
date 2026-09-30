(function () {
  const dict = window.PDC_I18N;
  const layers = window.PDC_LAYERS;
  let releaseInfo = {
    tag: "v2.2.0",
    date: "30 September 2026",
    url: "https://github.com/PrivacyDataCoin-Project/PDC/releases/latest",
    body: ""
  };

  function fill(value) {
    return value
      .replaceAll("{version}", releaseInfo.tag)
      .replaceAll("{date}", releaseInfo.date);
  }

  function formatNotes(body) {
    const escaped = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let html = "";
    let inList = false;
    function closeList() {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    }
    function inline(text) {
      return text
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }
    escaped.split("\n").forEach((line) => {
      if (line.startsWith("### ")) {
        closeList();
        html += "<h3>" + inline(line.slice(4)) + "</h3>";
      } else if (line.startsWith("## ")) {
        closeList();
        html += "<h2>" + inline(line.slice(3)) + "</h2>";
      } else if (line.startsWith("- ")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += "<li>" + inline(line.slice(2)) + "</li>";
      } else if (line.trim() === "") {
        closeList();
      } else {
        closeList();
        html += "<p>" + inline(line) + "</p>";
      }
    });
    closeList();
    return html;
  }

  function apply() {
    localStorage.removeItem("pdc-lang");
    document.documentElement.lang = "en";
    const table = dict.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = table[el.dataset.i18n];
      if (value == null) return;
      const text = fill(value);
      if (el.dataset.i18nHtml === "1") el.innerHTML = text;
      else el.textContent = text;
    });
    document.querySelectorAll("[data-release-url]").forEach((el) => {
      el.href = releaseInfo.url;
    });
    const notes = document.querySelector("[data-release-notes]");
    if (notes && releaseInfo.body) notes.innerHTML = formatNotes(releaseInfo.body);
    renderLayers();
  }

  window.PDC_USE_RELEASE = function (info) {
    releaseInfo = info;
    apply();
  };

  function renderLayers() {
    const host = document.querySelector("[data-layers]");
    if (!host || !layers) return;
    const pack = layers.en;
    const current = host.dataset.current || pack[0].id;
    host.dataset.current = current;
    host.innerHTML = pack.map((layer) => {
      const pressed = layer.id === current ? "true" : "false";
      return `<button class="layer" type="button" data-layer="${layer.id}" aria-pressed="${pressed}"><small>${layer.n} · ${layer.hides}</small><strong>${layer.name}</strong></button>`;
    }).join("");
    const layer = pack.find((item) => item.id === current) || pack[0];
    const title = document.querySelector("[data-layer-title]");
    const body = document.querySelector("[data-layer-body]");
    const meta = document.querySelector("[data-layer-meta]");
    if (title) title.textContent = layer.title;
    if (body) body.textContent = layer.body;
    if (meta) {
      meta.innerHTML = layer.meta.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    }
    document.querySelectorAll(".slip .field").forEach((field) => {
      field.classList.toggle("sealed", layer.seal.includes(field.dataset.field));
    });
  }

  document.addEventListener("click", (event) => {
    const layerBtn = event.target.closest("[data-layer]");
    if (layerBtn) {
      const host = document.querySelector("[data-layers]");
      host.dataset.current = layerBtn.dataset.layer;
      renderLayers();
      return;
    }
    const menu = event.target.closest("[data-menu]");
    if (menu) {
      const side = document.querySelector(".sidebar");
      const open = !side.classList.contains("open");
      side.classList.toggle("open", open);
      const backdrop = document.querySelector("[data-backdrop]");
      if (backdrop) backdrop.hidden = !open;
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (event.target.closest("[data-backdrop], .side-nav a")) {
      const side = document.querySelector(".sidebar");
      if (side) side.classList.remove("open");
      const backdrop = document.querySelector("[data-backdrop]");
      if (backdrop) backdrop.hidden = true;
      const btn = document.querySelector("[data-menu]");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });

  const promo = document.querySelector(".promo-video");
  if (promo) {
    promo.autoplay = false;
    promo.muted = false;
    promo.defaultMuted = false;
    promo.volume = 1;
    promo.pause();
  }

  apply();
})();
