#!/usr/bin/env python3
"""Six fully attributed CC0 image candidates for independent scene visual review.
These are THIRD-PARTY photos, never uncredited original AI artwork.
Do not publish or map directly into the live palette.
"""
from __future__ import annotations
import hashlib,html,io,json
from datetime import datetime,timezone
from pathlib import Path
from urllib.parse import urlparse
import requests
from PIL import Image,ImageOps,ImageEnhance

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"art-review"/"alternative-rooms"
API="https://commons.wikimedia.org/w/api.php"
ITEMS=(
  ("room-a","Warsaw Sunrise (Unsplash).jpg"),
  ("room-b","NY loft bedroom (Unsplash).jpg"),
  ("living-a","Furnished living room. (Unsplash).jpg"),
  ("living-b","Living room (Unsplash).jpg"),
  ("rain-a","Rainy window and table book (Unsplash).jpg"),
  ("study-a","Reading room (Unsplash).jpg"),
)
s=requests.Session()
s.headers.update({"User-Agent":"DailyPause-ArtReview/1.2 (https://github.com/daycool858000-hue/daily-pause-public)","Accept":"application/json,image/jpeg,*/*"})
def sha(data):return hashlib.sha256(data).hexdigest()
def get_info(name):
    res=s.get(API,params={"action":"query","format":"json","formatversion":2,
      "prop":"imageinfo","iiprop":"url|size|extmetadata","iiurlwidth":2500,
      "titles":"File:"+name},timeout=45)
    res.raise_for_status()
    pages=res.json()["query"]["pages"]
    if len(pages)!=1 or "imageinfo" not in pages[0]:
        raise ValueError("Missing Commons file page: "+name)
    i=pages[0]["imageinfo"][0]
    m=i.get("extmetadata",{})
    license=m.get("LicenseShortName",{}).get("value","")
    license_url=m.get("LicenseUrl",{}).get("value","")
    if license not in {"CC0","CC0 1.0"} and "publicdomain/zero" not in license_url:
        raise ValueError("License metadata is not explicit CC0: "+name)
    u=i.get("thumburl") or i.get("url")
    parsed=urlparse(u)
    if parsed.scheme!="https" or parsed.hostname not in ("upload.wikimedia.org","thumb.wikimedia.org"):
        raise ValueError("Not an official Wikimedia image hostname: "+str(parsed.hostname))
    return i,m,u
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    manifest={"scope":"draft photograph candidates for manual visual inspection only",
      "note":"Third-party CC0 images, NOT original AI-generated scenes. All EXIF/GPS removed.",
      "license":"https://creativecommons.org/publicdomain/zero/1.0/",
      "time_utc":datetime.now(timezone.utc).isoformat(),"photos":[]}
    for slot,name in ITEMS:
        info,m,url=get_info(name)
        photo=s.get(url,timeout=90);photo.raise_for_status()
        if len(photo.content)<80000:raise ValueError("Too small: "+name)
        with Image.open(io.BytesIO(photo.content)) as inp:
            image=ImageOps.exif_transpose(inp).convert("RGB")
        if image.width<1900 or image.height<1100:raise ValueError("Insufficient resolution: "+name)
        image=ImageOps.fit(image,(1920,1260),centering=(.5,.47),method=Image.Resampling.LANCZOS)
        image=ImageEnhance.Color(image).enhance(.91)
        image=ImageEnhance.Contrast(image).enhance(1.035)
        image=ImageEnhance.Brightness(image).enhance(1.04)
        file=OUT/f"palette-review-{slot}.webp"
        image.save(file,"WEBP",quality=90,method=6)
        manifest["photos"].append({
          "slot":slot,"filename":file.name,"sha256":sha(file.read_bytes()),
          "source_page":"https://commons.wikimedia.org/wiki/File:"+name.replace(" ","_"),
          "author":html.unescape(m.get("Artist",{}).get("value","")),
          "license":m["LicenseShortName"]["value"],
          "license_url":m.get("LicenseUrl",{}).get("value",""),
          "src_width":info["width"],"src_height":info["height"],"output":[1920,1260],
          "rights_status":"Commons lists CC0; independent photographic work",
          "review_status":"pending visual approval",
        })
        print("REVIEW_ASSET",slot,file.stat().st_size,flush=True)
    (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":main()
