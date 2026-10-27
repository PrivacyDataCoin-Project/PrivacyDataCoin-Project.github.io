(function () {
  var FEED_LOCAL = "/api/medium";
  var FEED_JINA = "https://r.jina.ai/https://medium.com/feed/@privacydatacoin";
  var CACHE_KEY = "pdc-medium-news-v1";
  var CACHE_MS = 5 * 60 * 1000;

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
  }

  function cleanLink(href) {
    try {
      var u = new URL(href);
      u.search = "";
      u.hash = "";
      return u.toString();
    } catch (e) {
      return String(href || "").split("?")[0];
    }
  }

  function formatDate(raw) {
    var d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw || "";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  function pickImage(itemEl, description) {
    var content = itemEl.querySelector("content\\:encoded, encoded");
    var html = (content && content.textContent) || description || "";
    var match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];
    var thumb = itemEl.querySelector("media\\:thumbnail, thumbnail, media\\:content, enclosure");
    if (thumb) {
      return thumb.getAttribute("url") || thumb.getAttribute("src") || "";
    }
    return "";
  }

  function parseRss(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid RSS");
    var nodes = Array.prototype.slice.call(doc.querySelectorAll("channel > item"));
    return nodes.map(function (item) {
      var title = (item.querySelector("title") || {}).textContent || "";
      var link = cleanLink((item.querySelector("link") || {}).textContent || "");
      var date = (item.querySelector("pubDate") || {}).textContent || "";
      var description = (item.querySelector("description") || {}).textContent || "";
      var summary = stripHtml(description).slice(0, 220);
      if (summary.length === 220) summary += "…";
      return {
        title: title.trim(),
        link: link,
        date: date,
        date_label: formatDate(date),
        summary: summary,
        img: pickImage(item, description)
      };
    }).filter(function (item) { return item.title && item.link; });
  }

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var packed = JSON.parse(raw);
      if (!packed || !packed.at || !Array.isArray(packed.items)) return null;
      if (Date.now() - packed.at > CACHE_MS) return null;
      return packed.items;
    } catch (e) {
      return null;
    }
  }

  function writeCache(items) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items: items }));
    } catch (e) {}
  }

  function render(host, items) {
    var limit = Number(host.dataset.newsLimit || items.length);
    var list = items.slice(0, limit);
    if (!list.length) {
      host.innerHTML = '<p class="note">No Medium posts loaded yet. <a href="https://medium.com/@privacydatacoin" target="_blank" rel="noreferrer">Open Medium</a></p>';
      return;
    }
    host.innerHTML = list.map(function (item) {
      var img = item.img
        ? '<img src="' + esc(item.img) + '" alt="" loading="lazy">'
        : '<div class="news-ph" aria-hidden="true"></div>';
      return (
        '<article class="card news-card">' +
          '<a class="block" href="' + esc(item.link) + '" target="_blank" rel="noreferrer">' +
            img +
            '<div class="body">' +
              "<time>" + esc(item.date_label || item.date) + "</time>" +
              "<h3>" + esc(item.title) + "</h3>" +
              "<p>" + esc(item.summary) + "</p>" +
            "</div>" +
          "</a>" +
        "</article>"
      );
    }).join("");
  }

  function fetchText(url, headers) {
    return fetch(url, { headers: headers || {}, credentials: "omit", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      });
  }

  function loadLive() {
    return fetchText(FEED_LOCAL)
      .catch(function () {
        return fetchText(FEED_JINA, { "X-Return-Format": "text", Accept: "application/xml,text/xml,*/*" });
      })
      .then(parseRss);
  }

  function boot() {
    var hosts = Array.prototype.slice.call(document.querySelectorAll("[data-news]"));
    if (!hosts.length) return;

    var cached = readCache();
    var fallback = Array.isArray(window.PDC_NEWS) ? window.PDC_NEWS : [];
    var initial = cached && cached.length ? cached : fallback;
    hosts.forEach(function (host) { render(host, initial); });

    loadLive()
      .then(function (items) {
        if (!items.length) throw new Error("empty");
        writeCache(items);
        window.PDC_NEWS = items;
        hosts.forEach(function (host) { render(host, items); });
      })
      .catch(function () {
        if (!initial.length) {
          hosts.forEach(function (host) {
            host.innerHTML = '<p class="note">Could not load Medium feed. <a href="https://medium.com/@privacydatacoin" target="_blank" rel="noreferrer">medium.com/@privacydatacoin</a></p>';
          });
        }
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
