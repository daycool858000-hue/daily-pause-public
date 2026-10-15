#!/usr/bin/env python3
"""Prepare separately photographed, license-documented scenery candidates.

Uses *explicitly verified free* Unsplash photo pages. Unlike the old photo-grid
crops, these are distinct photographs created by named third-party photographers.
Only install into art-review and development-only assets: NEVER represent them as
AI-generated original art or auto-approve a final public release.
"""
from __future__ import annotations

import hashlib
import io
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from html.parser import HTMLParser

import requests
from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "art-review" / "licensed-photo-candidates"
PHOTOS = (
    ("room", "sunlit-bedroom-with-a-view-of-green-trees-tNfH7JTAKTk", "Theo Laflamme"),
    ("living", "sunlight-streams-into-a-cozy-room-with-plants-vFYK8li2V_s", "Zahraa Hassan"),
    ("rain", "a-cup-of-coffee-sitting-on-top-of-a-table-next-to-a-window-jnGKklMLPhA", "Nav Rashmi Kalsi"),
    ("study", "cozy-room-with-desk-plants-and-fireplace-naSA5wFzIGk", "Valentin Blary"),
    ("island", "coastal-landscape-with-blue-ocean-and-green-hills-0i0PJMSHUlg", "Seval Torun"),
    ("balcony", "a-balcony-with-a-chair-and-a-potted-plant-on-it-uRyuWhB4o5A", "Ed Orozco"),
    ("cloud", "sunrise-over-a-sea-of-clouds-and-mountains-kqoZxZn7jyE", "Sergio Zhukov"),
    ("sunrise", "colorful-wildflowers-bloom-in-a-mountain-meadow-at-sunrise-pVfZmrNK5Mg", "Josh Behunin"),
)
BASE = "https://unsplash.com/photos/"
LICENSE = "https://unsplash.com/license"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; DailyPause-art-review/1.0; +https://github.com/daycool858000-hue/daily-pause-public)",
           "Accept": "text/html,application/xhtml+xml"}
class Meta(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = {}
    def handle_starttag(self, tag, attrs):
        if tag != "meta": return
        props = dict(attrs)
        key = props.get("property") or props.get("name")
        if key and props.get("content"):
            self.tags[key] = props["content"]

def verify_page(url, session):
    res = session.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
    res.raise_for_status()
    parser = Meta()
    parser.feed(res.text)
    if "Free to use under the Unsplash License" not in res.text and "unsplash.com/license" not in res.text:
        raise RuntimeError("Page does not verify its free-use license: "+url)
    source = parser.tags.get("og:image", "")
    # Do not fetch arbitrary links; avoid malicious or license-unknown redirects.
    if urlsplit(source).hostname != "images.unsplash.com":
        raise RuntimeError("Untrusted or missing first-party CDN image for "+url)
    return source, parser.tags.get("og:title", "")

def photo_url(image_url):
    u = urlsplit(image_url)
    if u.hostname != "images.unsplash.com":
        raise RuntimeError("Unexpected Unsplash CDN")
    # Canonical CDN path is discovered from the official photographer page.
    return urlunsplit(("https", u.netloc, u.path,
                       "auto=format&fit=crop&w=2400&h=1575&q=92", ""))

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    manifest = {
        "status":"independent THIRD-PARTY photography candidates; unapproved for final site",
        "date_utc":datetime.now(timezone.utc).isoformat(),
        "license":LICENSE,
        "usage":"Each photo is a licensed photographic work, NOT original AI generation.",
        "approval":"Must be visually checked and must not be published without the site owner's confirmation.",
        "output":"1920x1260 WebP for palette only; EXIF and GPS omitted.",
        "photos":[]
    }
    for kind,slug,author in PHOTOS:
        page = BASE + slug
        original_url, title = verify_page(page,session)
        url = photo_url(original_url)
        res = session.get(url,timeout=50,headers={"User-Agent":"Mozilla/5.0"})
        res.raise_for_status()
        if len(res.content)<120_000:
            raise RuntimeError("Image quality looks inadequate: "+kind)
        with Image.open(io.BytesIO(res.content)) as incoming:
            im = ImageOps.exif_transpose(incoming).convert("RGB")
        if min(im.size)<1100:
            raise RuntimeError(f"Too small for independent full artwork: {kind} {im.size}")
        im = ImageOps.fit(im,(1920,1260),method=Image.Resampling.LANCZOS,centering=(0.5,0.47))
        # A restrained consistent amber editorial grade, not an invented scene.
        im = ImageEnhance.Color(im).enhance(0.90)
        im = ImageEnhance.Contrast(im).enhance(1.035)
        file = OUTPUT / f"palette-photo-{kind}-v1.webp"
        im.save(file,"WEBP",quality=90,method=6)
        manifest["photos"].append({
            "scene":kind,
            "file":file.name,
            "sha256":hashlib.sha256(file.read_bytes()).hexdigest(),
            "source_page":page,
            "photographer":author,
            "license":LICENSE,
            "license_status":"Official photo page explicitly advertises free use; check page again before publication.",
            "photo_page_title":title,
            "dimensions":[1920,1260],
            "not_ai_generated":True,
            "no_exif_gps":True,
        })
        print(f"CREATED: {kind} {file.stat().st_size} bytes",flush=True)
    (OUTPUT/"source-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__ == "__main__":
    main()
