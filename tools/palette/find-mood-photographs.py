#!/usr/bin/env python3
"""Find and review CC0 photograph candidates for 11 distinct emotional scenes.

This is a draft selection pipeline, not a source of original generative art.
No third-party image is made live without explicit review and attribution.
"""
from __future__ import annotations
import hashlib,html,io,json,time,re
from pathlib import Path
from datetime import datetime,timezone
from urllib.parse import urlparse,quote
import requests
from PIL import Image,ImageOps,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"art-review"/"mood-photo-search"
API="https://commons.wikimedia.org/w/api.php"
SEARCHES={
 "fatigue":["soft warm bed bedroom","sunlit bedroom"],
 "stifled":["overgrown greenhouse plants","enclosed greenhouse interior"],
 "confusion":["fog mountain lake","misty woodland path"],
 "irritation":["rough sea dark sky","windy waves beach"],
 "fear":["forest night fog","misty dark forest"],
 "curiosity":["fern forest walking path","sunlight forest trail"],
 "reassurance":["cozy library book room","warm interior bookshelves"],
 "tenderness":["flowers butterflies meadow","golden hour wildflower field"],
 "renewal":["morning sunlight garden","spring green garden path"],
 "courage":["mountain ridge sunrise","snow mountain summit"],
 "warmth":["warm fireplace living room","cozy living room warm lamps"],
}
SESSION=requests.Session()
SESSION.headers.update({"User-Agent":"DailyPauseArtAudit/1.0 (https://github.com/daycool858000-hue/daily-pause-public)","Accept":"application/json,*/*"})
used=set()
rows=[]
font=ImageFont.load_default()
def api(params):
  for attempt in range(3):
    try:
      r=SESSION.get(API,params={"format":"json","formatversion":2,**params},timeout=30)
      r.raise_for_status()
      return r.json()
    except requests.RequestException:
      if attempt==2:raise
      time.sleep(1+attempt)
def search(q):
  # Wikimedia Commons search only: independently authored uploaded file pages.
  j=api({"action":"query","generator":"search","gsrsearch":q+" filetype:bitmap",
     "gsrnamespace":6,"gsrlimit":35,"prop":"imageinfo",
     "iiprop":"url|size|extmetadata","iiurlwidth":1200})
  return j.get("query",{}).get("pages",[])
def eligible(row):
  if "imageinfo" not in row:return None
  info=row["imageinfo"][0];meta=info.get("extmetadata",{})
  lic=meta.get("LicenseShortName",{}).get("value","")
  lic_url=meta.get("LicenseUrl",{}).get("value","")
  if lic not in {"CC0","CC0 1.0"} and "publicdomain/zero" not in lic_url:return None
  if info.get("width",0)<1800 or info.get("height",0)<1100:return None
  ratio=info["width"]/info["height"]
  if not 1.2<=ratio<=2.1:return None
  u=info.get("thumburl") or info.get("url")
  p=urlparse(u or "")
  if p.scheme!="https" or p.hostname not in {"upload.wikimedia.org","thumb.wikimedia.org"}:return None
  return info,meta,u
def convert(image_data):
  with Image.open(io.BytesIO(image_data)) as inp:
    im=ImageOps.exif_transpose(inp).convert("RGB")
  return ImageOps.fit(im,(480,315),method=Image.Resampling.LANCZOS,centering=(.5,.5))
def main():
  OUT.mkdir(parents=True,exist_ok=True)
  metadata={"source":"Wikimedia Commons official API imageinfo, explicit CC0 verification",
    "license":"https://creativecommons.org/publicdomain/zero/1.0/",
    "status":"thumbnail contact selection only; NOT approved new art",
    "created":datetime.now(timezone.utc).isoformat(),"candidates":[],"search_failures":[]}
  for mood,queries in SEARCHES.items():
    selected=0
    for query in queries:
      if selected>=3:break
      try:pages=search(query)
      except Exception as e:
        metadata["search_failures"].append({"mood":mood,"query":query,"error":str(e)})
        continue
      pages.sort(key=lambda row:sum(k in row.get("title","").lower() for k in query.split()),reverse=True)
      for page in pages:
        if selected>=3:break
        result=eligible(page)
        if not result:continue
        info,meta,url=result
        identity=page.get("title","")
        if identity in used:continue
        try:
          request=SESSION.get(url,timeout=35)
          request.raise_for_status()
          thumb=convert(request.content)
        except Exception:continue
        used.add(identity);slot=f"{mood}-{selected+1}"
        file=OUT/f"{slot}.webp"
        thumb.save(file,"WEBP",quality=82,method=6)
        author=meta.get("Artist",{}).get("value","")
        metadata["candidates"].append({
          "slot":slot,"mood":mood,"query":query,
          "source_page":"https://commons.wikimedia.org/wiki/"+quote(identity.replace(" ","_"),safe=":()"),
          "source_name":identity,"photographer_html":author,
          "license_short_name":meta.get("LicenseShortName",{}).get("value",""),
          "license_url":meta.get("LicenseUrl",{}).get("value",""),
          "original_dimensions":[info["width"],info["height"]],
          "webp_thumbnail_sha256":hashlib.sha256(file.read_bytes()).hexdigest(),
          "review":"unapproved"
        })
        selected+=1
        print("FOUND",slot,identity,flush=True)
    print("MOOD",mood,"COUNT",selected,flush=True)
  # Summary contact for agent-only visual inspection; it is not site artwork.
  cols=4;size=(480,315);cw=cols*480;rows_count=(len(metadata["candidates"])+cols-1)//cols
  if metadata["candidates"]:
    sheet=Image.new("RGB",(cw,max(1,rows_count)*350),(248,246,241))
    painter=ImageDraw.Draw(sheet)
    for k,entry in enumerate(metadata["candidates"]):
      x=k%cols*480;y=k//cols*350
      with Image.open(OUT/(entry["slot"]+".webp")) as image:sheet.paste(image,(x,y))
      label=entry["slot"]+" "+entry["source_name"][0:48]
      painter.text((x+8,y+320),label,font=font,fill=(45,38,33))
    sheet.save(OUT/"agent-contact.jpg",quality=84,optimize=True)
  (OUT/"manifest.json").write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
  if len(metadata["candidates"])==0:
    raise RuntimeError("No verified CC0 matches. Do not use unlicensed photographs.")


def build_curated():
  """Two individually sourced full-resolution composition candidates, kept offsite."""
  from PIL import ImageEnhance
  choices=(
    ("fear","Sequoia Trees at Sequoia National Park.jpg"),
    ("courage","Sunrise Bettmerhorn snowy mountains (Unsplash).jpg"),
  )
  items=[]
  for mood,filename in choices:
    result=api({"action":"query","prop":"imageinfo","iiprop":"url|size|extmetadata",
      "iiurlwidth":2500,"titles":"File:"+filename})
    pages=result.get("query",{}).get("pages",[])
    if len(pages)!=1 or "imageinfo" not in pages[0]:
      raise RuntimeError("Missing official photograph source: "+filename)
    valid=eligible(pages[0])
    if valid is None:raise RuntimeError("Not an explicitly verified full-resolution CC0 image: "+filename)
    info,meta,url=valid
    data=SESSION.get(url,timeout=60)
    data.raise_for_status()
    if len(data.content)<100000:raise RuntimeError("Image download too small: "+filename)
    with Image.open(io.BytesIO(data.content)) as photo:
      image=ImageOps.exif_transpose(photo).convert("RGB")
    if min(image.size)<1500:raise RuntimeError("Image source has insufficient native pixels")
    image=ImageOps.fit(image,(1920,1260),method=Image.Resampling.LANCZOS,centering=(.50,.50))
    image=ImageEnhance.Color(image).enhance(.88 if mood=="fear" else .92)
    image=ImageEnhance.Contrast(image).enhance(.97 if mood=="fear" else 1.035)
    if mood=="fear":
      # Preserve a visible, navigable forest corridor: dim but not pitch black.
      image=ImageEnhance.Brightness(image).enhance(.93)
    else:
      image=ImageEnhance.Brightness(image).enhance(1.08)
    output=OUT/f"palette-mood-{mood}-independent-v2.webp"
    output.parent.mkdir(parents=True,exist_ok=True)
    image.save(output,"WEBP",quality=91,method=6)
    items.append({
      "mood":mood,"file":output.name,
      "checksum_sha256":hashlib.sha256(output.read_bytes()).hexdigest(),
      "source_title":filename,
      "source_page":"https://commons.wikimedia.org/wiki/"+quote("File:"+filename.replace(" ","_"),safe=":()"),
      "source_license":meta.get("LicenseShortName",{}).get("value"),
      "source_license_url":meta.get("LicenseUrl",{}).get("value"),
      "original_dimensions":[info["width"],info["height"]],
      "author_html":meta.get("Artist",{}).get("value",""),
      "authorship":"third-party photography, NOT original AI generation",
      "approval":"draft only, manually validate scene suitability",
      "output_dimensions":[1920,1260],"exif_gps":"not exported"
    })
    print("CURATED",mood,output.stat().st_size,flush=True)
  manifest={"license_verified_at_source":True,
    "warning":"These are CC0 images, not new user-owned generative photo-realistic art.",
    "state":"art review only, not published",
    "items":items}
  (OUT/"curated-source-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":
  import sys
  if "--curated" in sys.argv:build_curated()
  else:main()
