#!/usr/bin/env python3
"""Fetch Medium RSS and write js/news-data.js fallback for static hosting."""
from __future__ import annotations

import json
import re
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FEED = "https://medium.com/feed/@privacydatacoin"
UA = "Mozilla/5.0 (compatible; PDC-site/1.0; +https://privacydatacoin.com)"
OUT = ROOT / "js" / "news-data.js"
NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "media": "http://search.yahoo.com/mrss/",
}


def strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    return re.sub(r"\s+", " ", text).strip()


def first_img(*blobs: str) -> str:
    for blob in blobs:
        m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', blob or "", re.I)
        if m:
            return m.group(1)
    return ""


def date_label(raw: str) -> str:
    try:
        dt = parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).strftime("%d %b %Y")
    except Exception:
        return (raw or "")[:16]


def clean_link(href: str) -> str:
    return (href or "").split("?", 1)[0].split("#", 1)[0]


def main() -> None:
    req = urllib.request.Request(FEED, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read()
    root = ET.fromstring(raw)
    items = []
    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = clean_link(item.findtext("link") or "")
        date = item.findtext("pubDate") or ""
        desc = item.findtext("description") or ""
        encoded = item.findtext("content:encoded", default="", namespaces=NS) or ""
        summary = strip_html(desc or encoded)[:220]
        if len(strip_html(desc or encoded)) > 220:
            summary += "…"
        img = first_img(encoded, desc)
        if not img:
            thumb = item.find("media:thumbnail", NS) or item.find("media:content", NS)
            if thumb is not None:
                img = thumb.get("url") or thumb.get("src") or ""
        if not title or not link:
            continue
        items.append(
            {
                "title": title,
                "link": link,
                "date": date,
                "date_label": date_label(date),
                "summary": summary,
                "img": img,
            }
        )
    OUT.write_text("window.PDC_NEWS = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print("wrote", OUT, "items", len(items))
    for it in items[:5]:
        print("-", it["date_label"], it["title"][:70])


if __name__ == "__main__":
    main()
