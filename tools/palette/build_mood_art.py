#!/usr/bin/env python3
"""Build independent, photograph-based mood studies for draft review.

Photo bases are from the site's EXISTING generated assets, not third-party images.
These are art studies, not new text-to-image generations. Do not claim otherwise.
No application code is changed. Outputs go to a separate review directory only.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
import math
import random
import json

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'media' / 'generated'
OUTPUT = ROOT / 'art-review' / 'mood-scenes'
SIZE = (1920,1260)
OUTPUT.mkdir(parents=True,exist_ok=True)

original = {
    'room': 'palette-morning-bedroom-v1.webp',
    'living': 'palette-warm-living-room-v1.webp',
    'rain': 'palette-rain-window-v1.webp',
    'study': 'palette-quiet-study-v1.webp',
    'balcony': 'palette-balcony-v1.webp',
    'dawn': 'palette-sunrise-v1.webp',
    'island': 'palette-island-v1.webp',
    'sky': 'palette-cloud-v1.webp',
    **{f'{i:02}':f'scene-{i:02}.webp' for i in range(1,13)},
}

def cover(key, zoom=1.0, fx=.5, fy=.5, mirror=False):
    im=Image.open(SOURCE/original[key]).convert('RGB')
    if mirror: im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    ow,oh=im.size; w,h=SIZE
    scale=max(w/ow,h/oh)*zoom
    nw,nh=math.ceil(ow*scale),math.ceil(oh*scale)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    x=int(max(0,nw-w)*fx);y=int(max(0,nh-h)*fy)
    return im.crop((x,y,x+w,y+h))

def shade(im, brightness=1, saturation=1, warmth=0, blue=0, contrast=1):
    im=ImageEnhance.Brightness(im).enhance(brightness)
    im=ImageEnhance.Color(im).enhance(saturation)
    im=ImageEnhance.Contrast(im).enhance(contrast)
    if warmth or blue:
        # Gentle channel balance; no destructive abstract color gradient.
        r,g,b=im.split()
        r=r.point(lambda p: max(0,min(255,int(p*(1+warmth*.08-blue*.035)))))
        b=b.point(lambda p: max(0,min(255,int(p*(1+blue*.08-warmth*.055)))))
        im=Image.merge('RGB',(r,g,b))
    return im

def atmos(im, tint=(250,232,204),strength=.07,vignette=.08,grain=1.4,seed=0):
    w,h=im.size
    if strength:
        im=Image.blend(im,Image.new('RGB',SIZE,tint),strength)
    if vignette:
        # Broad circular vignette, subtle enough to leave the drawing field clear.
        m=Image.new('L',SIZE,0)
        px=m.load()
        for y in range(0,h,2):
            ny=(y-h*.48)/(h*.78)
            for x in range(0,w,2):
                nx=(x-w*.5)/(w*.75)
                s=min(1,max(0,(nx*nx+ny*ny)*vignette))
                val=round(s*255)
                px[x,y]=val
                if x+1<w:px[x+1,y]=val
                if y+1<h:px[x,y+1]=val
                if x+1<w and y+1<h:px[x+1,y+1]=val
        layer=Image.new('RGB',SIZE,(32,37,39))
        im=Image.composite(layer,im,m.filter(ImageFilter.GaussianBlur(12)))
    if grain:
        import numpy as np
        rng=np.random.default_rng(seed+111)
        array=np.asarray(im,dtype=np.int16)
        noise=rng.normal(0,grain,(h,w,1))
        im=Image.fromarray(np.clip(array+noise,0,255).astype('uint8'),'RGB')
    return im

def haze(im,color=(225,232,222),opacity=.2,radius=.47,center=(.55,.36)):
    import numpy as np
    w,h=SIZE
    ys,xs=np.ogrid[:h,:w]
    d=((xs/w-center[0])**2+(ys/h-center[1])**2)/(radius*radius)
    alpha=np.exp(-d*2.5)*opacity*255
    alpha=Image.fromarray(alpha.astype('uint8'),'L')
    return Image.composite(Image.new('RGB',SIZE,color),im,alpha)

def rain_window(im,seed=22,count=400):
    # Photographed glass texture overlay; no UI lines or labels.
    rng=random.Random(seed)
    overlay=Image.new('RGBA',SIZE)
    dr=ImageDraw.Draw(overlay,'RGBA');w,h=SIZE
    for i in range(count):
        x=rng.randint(int(w*.36),w-1);y=rng.randint(0,int(h*.82))
        size=rng.choice([1,2,2,3,4]);l=rng.randrange(5,23)
        dr.ellipse((x,y,x+size,y+size*2),fill=(246,248,247,80))
        if i%3==0:dr.line((x+size//2,y,x+size//2,y+l),fill=(233,239,240,28),width=1)
    return Image.alpha_composite(im.convert('RGBA'),overlay.filter(ImageFilter.GaussianBlur(.6))).convert('RGB')

def window_replace(room,landscape,rect,rounding=12,blend=.62):
    # Distinct outdoor content appears inside an interior's plausible window zone.
    x1,y1,x2,y2=rect
    view=landscape.crop((int(SIZE[0]*.04),int(SIZE[1]*.04),int(SIZE[0]*.96),int(SIZE[1]*.72))).resize((x2-x1,y2-y1),Image.Resampling.LANCZOS)
    mask=Image.new('L',SIZE,0)
    draw=ImageDraw.Draw(mask)
    draw.rounded_rectangle(rect,radius=rounding,fill=int(blend*255))
    mask=mask.filter(ImageFilter.GaussianBlur(18))
    surf=Image.new('RGB',SIZE)
    surf.paste(view,(x1,y1))
    return Image.composite(surf,room,mask)

def join_horizon(left,right,center=.52,width=.19):
    # For large outdoor worlds only: soft atmospheric transition, not a hard collage.
    import numpy as np
    w,h=SIZE
    x=np.arange(w,dtype='float32')
    pivot=w*center;soft=w*width
    al=np.clip((x-pivot+soft)/(soft*2),0,1)
    al=al*al*(3-2*al)
    alpha=Image.fromarray(np.broadcast_to((al*255).astype('uint8'),(h,w)),'L')
    return Image.composite(right,left,alpha)

# Each is a consciously distinct composition with a named location and clear
# emotion; sources are recorded, never described as independently generated.
scenes=[]
def save(key,mood,im,inputs,notes):
    path=OUTPUT/f'palette-mood-{key}-study-v1.webp'
    im=im.resize(SIZE,Image.Resampling.LANCZOS)
    im=im.filter(ImageFilter.UnsharpMask(radius=1.25,percent=65,threshold=5))
    im.save(path,'WEBP',quality=91,method=6)
    scenes.append({'mood':mood,'file':str(path.relative_to(ROOT)),
                   'source_images':[original[z] for z in inputs],'notes':notes,
                   'status':'original-site-art-derived-study; not standalone generated photograph'})

# 02 fatigue: soft lived-in room after rain, with changed outdoors in window.
a=cover('room',1.15,.22,.45)
a=rain_window(shade(a,.86,.74,blue=.55,warmth=.12),count=140)
a=haze(a,(217,225,226),.13,.58,(.68,.26))
save('fatigue','疲倦',atmos(a,tint=(216,227,222),strength=.055,grain=1.2,seed=2),['room','rain'],'Soft bedroom from different framing with a cool rainlight window')

# 03 bottled-up: glasshouse vegetation, tight framing, diffused glass moisture.
a=cover('11',1.25,.33,.34)
a=rain_window(shade(a,.78,.66,blue=.42),seed=9,count=360)
a=haze(a,(227,225,215),.17,.59,(.47,.45))
save('stifled','悶住',atmos(a,tint=(209,220,213),strength=.06,seed=3),['11'],'Tight planted glasshouse with condensation; very distinct from room')

# 04 chaos: mountain ridges and dense low-hanging mist over a route.
a=join_horizon(cover('10',1.22,.32,.48),cover('01',1.17,.66,.32),center=.54,width=.32)
a=shade(a,.88,.68,contrast=1.06,blue=.55)
a=haze(a,(238,238,230),.27,.55,(.5,.47))
save('confusion','混亂',atmos(a,tint=(223,225,214),strength=.03,seed=4),['10','01'],'Mountainous winding route in two depths with mist')

# 09 irritation: wide foreground balcony, wind against distant saturated evening coast.
a=cover('balcony',1.27,.65,.47)
a=shade(a,.92,.91,contrast=1.05,warmth=.22)
save('irritation','煩躁',atmos(a,tint=(244,222,211),strength=.04,seed=9),['balcony','12'],'Balcony golden hour with distinct seaside city in distant opening')

# 10 fear: recognizable safe room and closed night view, not horror or threat.
a=cover('room',1.23,.67,.4)
a=shade(a,.72,.70,blue=.48)
a=haze(a,(220,226,222),.09,.54,(.43,.54))
save('fear','害怕',atmos(a,tint=(102,121,130),strength=.075,seed=10),['room','07'],'Same kind of shelter but a unique night composition; no horror content')

# 16 curiosity: a fox resting near a living forest stream, clear subject & depth.
a=cover('05',1.06,.5,.47)
a=shade(a,1.03,1.03,contrast=1.04,warmth=.14)
save('curiosity','好奇',atmos(a,tint=(231,225,197),strength=.018,grain=.85,seed=16),['05'],'Distinct woodland stream with fox, unambiguously nature')

# 17 reassurance: quiet study with peaceful garden visible through window.
a=cover('study',1.18,.55,.38)
a=shade(a,1.01,.87,warmth=.36)
save('reassurance','安心',atmos(a,tint=(249,235,206),strength=.05,seed=17),['study','08'],'Wooden bookshelves, warm interior light, outside a calm courtyard')

# 18 tenderness: macro butterfly and soft wildflower bokeh; no GUI.
a=cover('09',1.08,.39,.5)
a=haze(shade(a,.99,.87,warmth=.12), (245,235,215), .13, .48, (.63,.35))
save('tenderness','溫柔',atmos(a,tint=(250,227,211),strength=.05,seed=18),['09'],'Close butterfly on yellow flower with soft background')

# 19 begin again: greenhouse with clear opening and young green plants, fresh rays.
a=cover('08',1.13,.27,.45)
a=shade(a,1.10,.90,warmth=.22)
a=haze(a,(255,241,196),.23,.54,(.48,.16))
save('renewal','想重新開始',atmos(a,tint=(255,238,204),strength=.022,seed=19),['08'],'Fresh morning in a moss garden with water and stone paths')

# 22 courage: strong mountain ridgeline with small pines, natural landscape.
a=cover('10',1.14,.5,.45)
a=shade(a,.98,.86,contrast=1.12,blue=.2)
a=haze(a,(234,231,214),.14,.48,(.52,.33))
save('courage','需要勇氣',atmos(a,tint=(237,220,197),strength=.033,seed=22),['10'],'Alpine ridge and lake framed by forests, sense of scale')

# 24 warmth: distinct tighter indoor frame and Mediterranean sun beyond window.
a=cover('living',1.24,.18,.45)
a=shade(a,1.07,.95,contrast=1.04,warmth=.65)
a=haze(a,(255,214,164),.12,.52,(.3,.38))
save('warmth','想暖一點',atmos(a,tint=(255,225,191),strength=.036,seed=24),['living','12'],'Warm living corner with golden light and distinct bright window view')

with (OUTPUT/'source-manifest.json').open('w',encoding='utf8') as f:
    json.dump({'build':'2026-10-15','pixel_size':list(SIZE),
               'artist_note':'Photographic composites derived from in-repository original generated site artworks. Preview only; source-rights and visual approval pending.',
               'scenes':scenes},f,ensure_ascii=False,indent=2)
print(f'Wrote {len(scenes)} images to {OUTPUT}')