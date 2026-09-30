(function () {
  const repo = "PrivacyDataCoin-Project/PDC";
  const endpoint = "https://api.github.com/repos/" + repo + "/releases/latest";
  const latestDownload = "https://github.com/" + repo + "/releases/latest/download/";

  function megabytes(size) {
    const mb = Number(size) / 1048576;
    if (!Number.isFinite(mb) || mb <= 0) return "";
    return (mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10) + " MB";
  }

  function rank(name) {
    const n = name.toLowerCase();
    const os = n.includes("ubuntu") || n.includes("linux") || n.includes("appimage") ? 0
      : n.includes("windows") || n.endsWith(".exe") ? 1
      : n.includes("osx") || n.includes("mac") ? 2
      : 3;
    const kind = n.endsWith(".appimage") ? 0
      : n.endsWith(".exe") ? 1
      : n.endsWith(".tar.gz") || n.endsWith(".tgz") ? 2
      : n.endsWith(".zip") ? 3
      : 4;
    return os * 10 + kind;
  }

  function label(name) {
    const n = name.toLowerCase();
    let os = "";
    if (n.includes("ubuntu") || n.includes("linux") || n.includes("appimage")) os = "Linux";
    else if (n.includes("windows") || n.endsWith(".exe")) os = "Windows";
    else if (n.includes("osx") || n.includes("mac")) os = "macOS";
    let kind = "";
    if (n.endsWith(".appimage")) kind = "AppImage";
    else if (n.endsWith(".exe")) kind = "installer";
    else if (n.endsWith(".tar.gz") || n.endsWith(".tgz")) kind = "tar.gz";
    else if (n.endsWith(".zip")) kind = "zip";
    else if (n.endsWith(".dmg")) kind = "dmg";
    if (os && kind) return os + " " + kind;
    return name;
  }

  function isGui(name) {
    return /gui/i.test(name);
  }

  function paintFiles(info) {
    document.querySelectorAll("[data-release-files]").forEach((box) => {
      const wantGui = box.dataset.releaseFiles === "gui";
      const assets = info.assets.filter((asset) => isGui(asset.name) === wantGui).sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
      if (!assets.length) return;
      box.querySelectorAll("a").forEach((link) => link.remove());
      assets.forEach((asset) => {
        const link = document.createElement("a");
        link.href = latestDownload + encodeURIComponent(asset.name);
        link.append(document.createTextNode(label(asset.name) + " "));
        const size = document.createElement("span");
        size.textContent = megabytes(asset.size);
        link.append(size);
        box.append(link);
      });
    });
  }

  function published(iso) {
    const when = new Date(iso);
    if (Number.isNaN(when.getTime())) return "";
    return when.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  fetch(endpoint, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then((release) => {
      const info = {
        tag: release.tag_name || "",
        date: published(release.published_at),
        url: "https://github.com/" + repo + "/releases/latest",
        body: (release.body || "").trim(),
        assets: Array.isArray(release.assets) ? release.assets : []
      };
      if (typeof window.PDC_USE_RELEASE === "function") window.PDC_USE_RELEASE(info);
      if (info.assets.length) paintFiles(info);
    })
    .catch(function () {});
})();
