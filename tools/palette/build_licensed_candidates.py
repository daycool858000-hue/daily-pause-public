#!/usr/bin/env python3
"""Build eight *third-party CC0 photographic* alternative palette art candidates.

Never call these original AI-generated works. Every photo is requested through
Wikimedia Commons' imageinfo API, with explicit CC0 metadata verification.
This script preserves existing background art and writes candidates for visual
review on the unmerged development branch only.
"""
from __future__ import annotations
import hashlib, io, json
from datetime import datetime, timezone
from pathlib import Path
import requests
from PIL import Image, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "art-review" / "licensed-photo-candidates"
API = "https://commons.wikimedia.org/w/api.php"
LICENSE = "https://creativecommons.org/publicdomain/zero/1.0/"
IMAGES = [
    ("room", "Photographer's Bedroom (Unsplash).jpg"),
    ("living", "Cozy interior with a sofa (Unsplash).jpg"),
    ("rain", "RaindropsOnWindow.jpg"),
    ("study", "Study Room, Malacañang of the North, Paoay, Ilocos Norte.jpg"),
    ("island", "Maldives tropical island (Unsplash).jpg"),
    ("balcony", "Sunset over Rio de Janeiro seen from a balcony, Brazil.jpg"),
    ("cloud", "Sea of clouds (Unsplash).jpg"),
    ("sunrise", "Sunrise over the mountains.jpg"),
]
SESSION=requests.Session()
SESSION.headers.update({
  "User-Agent":"DailyPauseArtworkAudit/1.1 (source and attribution: https://github.com/daycool858000-hue/daily-pause-public)",
  "Accept":"application/json,image/jpeg,*/*"
})

def sha(data):
    return hashlib.sha256(data).hexdigest()

def query(title):
    r=SESSION.get(API,params={
      "action":"query","format":"json","formatversion":2,
      "prop":"imageinfo","iiprop":"url|size|extmetadata",
      "iiurlwidth":2500,"titles":"File:"+title
    },timeout=30)
    r.raise_for_status()
    pages=r.json()["query"]["pages"]
    if len(pages)!=1 or "imageinfo" not in pages[0]:
        raise ValueError("Official file metadata unavailable: "+title)
    return pages[0]["imageinfo"][0]

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    manifest={
      "status":"Unapproved third-party CC0 photography candidates; NOT original AI imagery.",
      "license":LICENSE,
      "source":"Wikimedia Commons official imageinfo API and individual file pages",
      "generated_utc":datetime.now(timezone.utc).isoformat(),
      "usage":"Don't deploy without reviewing visual match and provenance",
      "output":"1920x1260 WebP with no EXIF metadata",
      "photos":[]
    }
    for scene,title in IMAGES:
        info=query(title)
        metadata=info.get("extmetadata",{})
        license_name=metadata.get("LicenseShortName",{}).get("value","")
        license_url=metadata.get("LicenseUrl",{}).get("value","")
        if license_name not in ("CC0","CC0 1.0") and "publicdomain/zero" not in license_url:
            raise ValueError("Not confirmed CC0 by official API: "+title+" "+license_name)
        src=info.get("thumburl") or info.get("url")
        if not src or not src.startswith("https://upload.wikimedia.org/"):
            raise ValueError("Untrusted download source for "+title)
        res=SESSION.get(src,timeout=75)
        res.raise_for_status()
        with Image.open(io.BytesIO(res.content)) as loaded:
            im=ImageOps.exif_transpose(loaded).convert("RGB")
        if im.width<1900 or im.height<1100:
            raise ValueError("Not adequate for 1920x1260: "+title+" "+str(im.size))
        im=ImageOps.fit(im,(1920,1260),centering=(.5,.47),method=Image.Resampling.LANCZOS)
        im=ImageEnhance.Color(im).enhance(.93)
        output=OUT/f"palette-photo-{scene}-v1.webp"
        im.save(output,"WEBP",quality=88,method=6)
        source_link="https://commons.wikimedia.org/wiki/File:"+requests.utils.quote(title.replace(" ","_"))
        manifest["photos"].append({
          "scene":scene,"source_title":title,"source_page":source_link,
          "license_short_name":license_name,"license_url":license_url or LICENSE,
          "source_sha256":sha(res.content),"candidate":output.name,
          "candidate_sha256":sha(output.read_bytes()),
          "dimensions":[1920,1260],"original_size":[info["width"],info["height"]],
          "source_photographer_metadata":metadata.get("Artist",{}).get("value",""),
          "source_not_original_ai_art":True, "exif_removed":True
        })
        print("BUILT:",scene,output.stat().st_size,flush=True)
    (OUT/"source-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":
    main()
