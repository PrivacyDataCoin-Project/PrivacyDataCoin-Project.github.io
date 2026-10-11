(function () {
  const endpoint = "https://api.github.com/repos/PrivacyDataCoin-Project/PDC/releases/latest";

  function megabytes(size) {
    const mb = Number(size) / 1048576;
    if (!Number.isFinite(mb) || mb <= 0) return "";
    return (mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10) + " MB";
  }

  function rank(name) {
    const n = name.toLowerCase();
    const gui = /gui/.test(n) ? 0 : 1;
    const os = n.includes("ubuntu") || n.includes("linux") || n.includes("appimage") ? 0
      : n.includes("windows") || n.endsWith(".exe") ? 1
      : n.includes("osx") || n.includes("mac") ? 2
      : 3;
    const kind = n.endsWith(".appimage") ? 0
      : n.endsWith(".exe") ? 1
      : n.endsWith(".tar.gz") || n.endsWith(".tgz") ? 2
      : n.endsWith(".zip") ? 3
      : 4;
    return gui * 100 + os * 10 + kind;
  }

  function role(name) {
    const n = name.toLowerCase();
    const gui = /gui/.test(n);
    const linux = n.includes("ubuntu") || n.includes("linux") || n.includes("appimage");
    const windows = n.includes("windows") || n.endsWith(".exe");
    const mac = n.includes("osx") || n.includes("mac");
    if (gui && n.endsWith(".appimage")) return "Linux desktop wallet";
    if (gui && n.endsWith(".exe")) return "Windows installer";
    if (gui && linux) return "Linux desktop wallet archive";
    if (gui && windows) return "Windows desktop wallet archive";
    if (gui && mac) return "macOS desktop wallet";
    if (gui) return "Desktop wallet";
    if (linux) return "Linux daemon and simplewallet";
    if (windows) return "Windows daemon and simplewallet";
    if (mac) return "macOS daemon and simplewallet";
    return "Daemon and simplewallet";
  }

  function published(iso) {
    const when = new Date(iso);
    if (Number.isNaN(when.getTime())) return "";
    return when.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  function paintFiles(assets) {
    const sorted = assets.slice().sort(function (a, b) {
      return rank(a.name) - rank(b.name) || a.name.localeCompare(b.name);
    });
    document.querySelectorAll("[data-release-files]").forEach(function (box) {
      const body = box.querySelector("tbody");
      if (!body || !sorted.length) return;
      body.replaceChildren();
      sorted.forEach(function (asset) {
        const row = document.createElement("tr");
        const file = document.createElement("td");
        const link = document.createElement("a");
        link.href = asset.browser_download_url;
        link.textContent = asset.name;
        file.append(link);
        const kind = document.createElement("td");
        kind.textContent = role(asset.name);
        const size = document.createElement("td");
        size.textContent = megabytes(asset.size);
        row.append(file, kind, size);
        body.append(row);
      });
    });
  }

  fetch(endpoint, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (response) {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then(function (release) {
      const tag = release.tag_name || "";
      const date = published(release.published_at);
      const url = release.html_url || "";
      if (tag) {
        document.querySelectorAll("[data-doc-version]").forEach(function (node) {
          node.textContent = tag;
        });
      }
      if (date) {
        document.querySelectorAll("[data-doc-date]").forEach(function (node) {
          node.textContent = date;
        });
      }
      if (url) {
        document.querySelectorAll("[data-doc-release]").forEach(function (node) {
          node.href = url;
        });
      }
      if (Array.isArray(release.assets) && release.assets.length) paintFiles(release.assets);
    })
    .catch(function () {});
})();
