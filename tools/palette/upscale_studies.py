#!/usr/bin/env python3
"""Produce reversible AI super-resolution candidates for the eight grid-cropped
palette studies. This does NOT convert those studies into original photographs.

This script never overwrites the source assets. It fails if the requested
licensed EDSR model is absent, rather than silently falling back to resizing.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

import cv2
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "media" / "generated"
OUTPUT = ROOT / "art-review" / "restored-landscapes"
MODEL = ROOT / "art-review" / "weights" / "EDSR_x2.pb"
NAMES = (
    "palette-morning-bedroom-v1.webp",
    "palette-warm-living-room-v1.webp",
    "palette-rain-window-v1.webp",
    "palette-quiet-study-v1.webp",
    "palette-island-v1.webp",
    "palette-balcony-v1.webp",
    "palette-cloud-v1.webp",
    "palette-sunrise-v1.webp",
)

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def sr_tiled(image: np.ndarray, net, tile: int = 128, pad: int = 12) -> np.ndarray:
    h,w = image.shape[:2]
    result = np.empty((h*2,w*2,3),np.uint8)
    for y in range(0,h,tile):
        for x in range(0,w,tile):
            x1=max(0,x-pad); y1=max(0,y-pad)
            x2=min(w,x+tile+pad); y2=min(h,y+tile+pad)
            patch = image[y1:y2,x1:x2]
            high = net.upsample(patch)
            fromx=(x-x1)*2; fromy=(y-y1)*2
            outw=min(tile,w-x)*2; outh=min(tile,h-y)*2
            piece=high[fromy:fromy+outh,fromx:fromx+outw]
            if piece.shape != (outh,outw,3):
                raise RuntimeError("Tile output dimension mismatch")
            result[y*2:y*2+outh,x*2:x*2+outw]=piece
    return result

def main():
    if not MODEL.is_file() or MODEL.stat().st_size < 1_000_000:
        raise FileNotFoundError("EDSR model unavailable; cannot declare AI upscaling complete")
    cv2.setNumThreads(3)
    net=cv2.dnn_superres.DnnSuperResImpl_create()
    net.readModel(str(MODEL))
    net.setModel("edsr",2)
    OUTPUT.mkdir(parents=True,exist_ok=True)
    manifest={
        "status":"development-study-only; not standalone original artwork; visual approval needed",
        "model":"Saafke/EDSR_Tensorflow EDSR_x2.pb",
        "model_source":"https://github.com/Saafke/EDSR_Tensorflow/blob/master/models/EDSR_x2.pb",
        "model_license":"Apache-2.0 (see source repository LICENSE)",
        "model_sha256":sha(MODEL),
        "method":"2x pretrained neural super-resolution, not prompt-based scene generation",
        "scenes":[]
    }
    for filename in NAMES:
        path=SOURCE/filename
        if not path.exists():raise FileNotFoundError(path)
        with Image.open(path) as im:
            if im.size != (960,630):
                raise RuntimeError(f"Unexpected original dimensions for {filename}: {im.size}")
            img=np.asarray(im.convert("RGB"))[:,:,::-1].copy()
        higher=sr_tiled(img,net)
        output=OUTPUT/filename.replace("-v1.webp","-sr-v2.webp")
        Image.fromarray(cv2.cvtColor(higher,cv2.COLOR_BGR2RGB)).save(output,"WEBP",quality=92,method=6)
        check=Image.open(output)
        if check.size!=(1920,1260):raise AssertionError(output)
        manifest["scenes"].append({
            "source":filename,"source_sha256":sha(path),
            "candidate":output.name,"sha256":sha(output),
            "dimensions":[1920,1260],
            "provenance":"restoration of site-owned cropped concept-grid study; original composition unchanged"
        })
        print("RESTORED",filename,output.stat().st_size,flush=True)
    (OUTPUT/"source-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":
    main()
