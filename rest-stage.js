// Original, lightweight watercolor scenes for the fifteen quiet-rest activities.
// Handmade SVG + CSS animations; no external images or fixed therapeutic breathing pace.
(() => {
'use strict';
const keys=[['看窗外','window'],['放鬆手指','hands'],['環境聲音','sound'],['一口水','cup'],['舒服的位置','chair'],['看遠方','hills'],['光影','sunlight'],['閉眼','eyes'],['伸展','stretch'],['手機','phone'],['微笑','flower'],['小角落','desk'],['花或一片葉子','leaf'],['問題','paper'],['收尾','night']];
const defs='<defs>'
+'<linearGradient id="r-sky" x2="0.3" y2="1"><stop stop-color="#fff0d8"/><stop offset=".52" stop-color="#e7e9df"/><stop offset="1" stop-color="#d1dfd6"/></linearGradient>'
+'<linearGradient id="r-sage" x2="1" y2="1"><stop stop-color="#b9cbb2"/><stop offset=".6" stop-color="#8cafa1"/><stop offset="1" stop-color="#698e82"/></linearGradient>'
+'<linearGradient id="r-linen" x2="1" y2="1"><stop stop-color="#fdf9ed"/><stop offset=".5" stop-color="#eee4d5"/><stop offset="1" stop-color="#d7cebf"/></linearGradient>'
+'<linearGradient id="r-skin" x2=".2" y2="1"><stop stop-color="#f5d5bd"/><stop offset=".65" stop-color="#dcb29d"/><stop offset="1" stop-color="#c79787"/></linearGradient>'
+'<radialGradient id="r-light"><stop stop-color="#fff6d5" stop-opacity=".85"/><stop offset="1" stop-color="#fff6d5" stop-opacity="0"/></radialGradient>'
+'<radialGradient id="r-mist"><stop stop-color="#fffaf1" stop-opacity=".75"/><stop offset="1" stop-color="#fffaf1" stop-opacity="0"/></radialGradient>'
+'<filter id="r-blur"><feGaussianBlur stdDeviation="9"/></filter>'
+'<filter id="r-texture"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="3" seed="14"/><feColorMatrix type="saturate" values=".2"/><feComponentTransfer><feFuncA type="linear" slope=".10"/></feComponentTransfer></filter>'
+'</defs>';
const leaf='<g class="r-sway"><path d="M224 348Q206 240 230 136" fill="none" stroke="#829780" stroke-width="6" stroke-linecap="round"/>'
+'<path d="M223 176Q91 84 94 190Q151 254 223 176Z" fill="url(#r-sage)"/><path d="M228 235Q365 121 366 235Q304 290 228 235Z" fill="url(#r-sage)"/>'
+'<path d="M220 176L113 166M226 233L354 221" fill="none" stroke="#f8f1d5" stroke-width="3" opacity=".7"/>'
+'<g fill="none" stroke="#eee9ca" stroke-width="1.6" opacity=".6"><path d="M153 169L130 134M160 173L136 210M285 229L312 192M311 224L335 249"/></g></g>';
const grass='<g class="r-sway" stroke="#8ba895" stroke-width="3" stroke-linecap="round" fill="none"><path d="M48 380Q77 325 60 260M86 380Q91 322 113 278M348 380Q330 319 350 255M391 380Q410 320 395 275"/></g>';
const windowScene='<rect x="78" y="48" width="287" height="270" rx="7" fill="#f7eddb"/>'
+'<rect x="93" y="62" width="257" height="213" fill="#c5d8c9"/>'
+'<path d="M93 239Q149 191 212 223T350 204V277H93Z" fill="#a9c6b3"/><path d="M93 266Q173 219 251 245T350 218V277H93Z" fill="#8eb09c"/>'
+'<path d="M223 63V277M92 172H350" stroke="#f8f0e1" stroke-width="12"/>'
+'<path class="r-curtain" d="M81 48Q152 58 135 178T118 312H72Q107 177 81 48Z" fill="url(#r-linen)" opacity=".88"/>'
+'<path class="r-curtain" d="M361 49Q320 100 338 176T375 315H406Q362 159 361 49Z" fill="url(#r-linen)" opacity=".86"/>'
+'<path d="M91 274H354L373 313H71Z" fill="#dcccba"/><path class="r-glow" d="M160 68L329 273" stroke="#f9edd2" stroke-width="28" opacity=".21"/>';
const hills='<path d="M0 257Q100 161 164 184T289 214Q363 145 440 202V380H0Z" fill="#b9cdbd"/>'
+'<path d="M0 287Q102 219 186 255T346 211T440 259V380H0Z" fill="#91b1a3"/>'
+'<path d="M0 321Q132 276 239 303T440 275V380H0Z" fill="#71988b" opacity=".84"/>'
+'<g class="r-cloud" fill="#fffaf0" opacity=".63"><ellipse cx="126" cy="112" rx="100" ry="14"/><ellipse cx="315" cy="79" rx="75" ry="12"/></g>'+grass;
const flower='<g class="r-sway"><path d="M221 345Q227 248 233 179" fill="none" stroke="#799b86" stroke-width="7" stroke-linecap="round"/>'
+'<path d="M218 258Q144 196 125 232Q157 282 218 258ZM233 285Q308 225 326 253Q295 306 233 285Z" fill="url(#r-sage)"/>'
+'<g class="r-bloom" fill="url(#r-skin)" stroke="#d6aa9a" stroke-width="1.8"><path d="M229 166Q181 143 183 107Q203 64 228 116Q250 67 276 107Q285 141 244 170Q306 147 307 186Q290 218 245 188Q253 245 215 234Q186 228 208 190Q153 206 156 175Q162 152 229 166Z"/></g>'
+'<circle cx="230" cy="176" r="21" fill="#e6c790"/><path d="M230 172L208 155M230 172L251 157M230 172L259 182" stroke="#a38969" stroke-width="2"/></g>';
const floor='<path d="M0 294Q185 282 440 295V380H0Z" fill="#dbc8b3" opacity=".65"/>';
const body={
window:windowScene,
hands:'<ellipse cx="223" cy="317" rx="149" ry="28" fill="#b2b4a5" opacity=".2" filter="url(#r-blur)"/>'
+'<g class="r-hands" fill="url(#r-skin)" stroke="#bc9488" stroke-width="2" stroke-linejoin="round">'
+'<path d="M84 312Q109 281 123 249L146 203Q151 189 162 193Q173 199 163 220L154 244L181 145Q186 128 198 135Q205 140 201 156L187 224L217 116Q224 102 236 110Q244 115 238 135L213 224L251 146Q263 131 273 142Q277 150 268 168L227 252L280 205Q294 191 303 205Q310 216 290 236L243 290Q224 316 208 333Z"/>'
+'<path d="M355 316Q330 289 314 265L290 221Q283 204 273 210Q265 216 275 234L284 254L261 203Q253 186 244 195Q239 200 248 218L265 268L238 228Q224 209 215 219Q211 226 220 242L251 296Q264 321 281 333Z" opacity=".77"/></g>'
+'<path d="M121 290Q151 276 169 281M180 306Q217 292 241 298" stroke="#f2d4c3" fill="none" stroke-width="2"/>',
sound:hills+'<g class="r-breeze" fill="none" stroke="#fff8df" stroke-width="3" opacity=".58"><path d="M88 167Q213 136 344 169"/><path d="M120 195Q210 184 300 205"/></g>',
cup:floor+'<ellipse cx="224" cy="307" rx="134" ry="17" fill="#aca998" opacity=".18"/>'
+'<path d="M141 154Q217 172 295 155L281 280Q219 307 161 283Z" fill="url(#r-linen)" stroke="#cfb5a0" stroke-width="3"/>'
+'<path d="M295 170Q348 150 348 220Q341 254 286 245" stroke="#d9bba8" stroke-width="18" fill="none" stroke-linecap="round"/>'
+'<ellipse cx="220" cy="156" rx="77" ry="14" fill="#c9a588" stroke="#f3e9dc" stroke-width="5"/>'
+'<g class="r-steam" stroke="#fffaf1" stroke-width="6" stroke-linecap="round" fill="none" opacity=".78"><path d="M179 143Q163 118 181 97T176 45"/><path d="M224 134Q204 105 225 80T221 33"/><path d="M264 139Q246 110 264 88T262 47"/></g>',
chair:windowScene+floor+'<path d="M182 291L165 164Q159 133 191 118H318Q348 121 346 161L336 291Z" fill="url(#r-sage)" stroke="#97aa9c" stroke-width="3"/>'
+'<path d="M167 242Q176 216 202 214H327Q350 221 345 256L337 290H183Z" fill="#dbc3b0"/>'
+'<rect x="188" y="178" width="101" height="70" rx="24" fill="url(#r-linen)"/>'
+'<path d="M180 286L172 342M338 288L345 345" stroke="#aa917c" stroke-width="12" stroke-linecap="round"/>',
hills,
sunlight:windowScene+floor+'<path class="r-glow" d="M164 72L392 328L352 366L112 135Z" fill="#fff1c7" opacity=".34"/>'
+'<path class="r-glow" d="M111 79L307 314L265 364L72 142Z" fill="#ffead0" opacity=".23"/>'
+'<g class="r-shadows" fill="#92aa98" opacity=".31"><path d="M28 338Q133 237 211 323Q116 302 28 338Z"/><path d="M211 358Q249 256 344 305Q277 353 211 358Z"/></g>',
eyes:hills+'<ellipse class="r-mist" cx="232" cy="217" rx="235" ry="91" fill="url(#r-mist)" opacity=".86"/>',
stretch:hills+'<g class="r-sway" fill="none" stroke="#809b86" stroke-width="5" stroke-linecap="round"><path d="M212 368Q204 266 225 133T295 75"/><path d="M213 253Q154 199 124 209M229 182Q277 143 315 157"/></g>'
+'<g class="r-sway" fill="#a5bc9f"><path d="M225 176Q176 126 167 177Q199 210 225 176ZM213 249Q147 191 134 221Q145 266 213 249ZM230 148Q280 95 315 117Q304 157 230 148Z"/></g>',
phone:windowScene+floor+'<path d="M66 283H376V302H66Z" fill="#bca18a"/>'
+'<g transform="rotate(-11 230 244)"><rect x="172" y="217" width="116" height="53" rx="12" fill="#718780"/><rect x="180" y="224" width="100" height="39" rx="7" fill="#b3c1b6"/></g>',
flower,
desk:floor+'<path d="M60 274H382V296H60Z" fill="#bba18b"/>'
+'<g transform="rotate(-6 222 203)"><rect x="133" y="160" width="190" height="87" rx="5" fill="#faf3e7"/><path d="M162 189H290M162 211H273M169 231H238" stroke="#cdbdaf" stroke-width="2.5"/></g>'
+'<path d="M319 176L341 246" stroke="#bb9578" stroke-width="8" stroke-linecap="round"/>'+grass,
leaf,
paper:floor+'<g transform="rotate(-5 217 190)"><rect x="116" y="54" width="223" height="271" rx="6" fill="#dbcdbb" opacity=".6"/><rect x="107" y="46" width="223" height="272" rx="5" fill="url(#r-linen)"/>'
+'<path d="M144 111H286M145 143H278M144 176H297M144 208H263" stroke="#cdbdaf" stroke-width="2.6" opacity=".8"/></g>'
+'<path d="M329 140L341 250" stroke="#bc967c" stroke-width="8" stroke-linecap="round"/>',
night:'<rect width="440" height="380" fill="#819c98" opacity=".79"/><circle cx="289" cy="95" r="47" fill="#f6e7c9" class="r-glow"/>'
+'<path d="M0 254Q100 211 201 261T440 241V380H0Z" fill="#8bab9d"/>'
+'<path d="M0 298Q130 249 240 291T440 272V380H0Z" fill="#608a82"/>'
+grass+'<g class="r-twinkle" fill="#fff0d6"><circle cx="71" cy="99" r="2.4"/><circle cx="137" cy="137" r="2"/><circle cx="365" cy="168" r="2.7"/><circle cx="222" cy="62" r="2"/></g>'
};
function sceneKey(title){return keys.find(([k])=>String(title||'').includes(k))?.[1]||'window'}
function init(){
 const modal=document.getElementById('restStage');if(!modal)return;
 const art=modal.querySelector('.rest-stage-art'),heading=modal.querySelector('.rest-stage-heading');
 const line=modal.querySelector('.rest-stage-text'),note=modal.querySelector('.rest-stage-note');
 let returnFocus=null;
 function close(){
  if(modal.hidden)return;
  modal.hidden=true;document.body.classList.remove('rest-theatre-open');
  art.replaceChildren();returnFocus?.isConnected&&returnFocus.focus({preventScroll:true});
  returnFocus=null;
 }
 function open(item){
  if(!item)return;
  returnFocus=document.activeElement;
  const kind=sceneKey(item.title);heading.textContent=item.title;line.textContent=item.text;
  note.textContent=item.note||'不用照著任何速度完成。';
  art.dataset.type=kind;
  art.innerHTML='<svg viewBox="0 0 440 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
     +defs+'<rect width="440" height="380" fill="url(#r-sky)"/>'
     +'<ellipse cx="323" cy="105" rx="175" ry="175" fill="url(#r-light)" class="r-glow"/>'
     +(body[kind]||body.window)
     +'<rect width="440" height="380" filter="url(#r-texture)" opacity=".43" pointer-events="none"/></svg>';
  modal.hidden=false;document.body.classList.add('rest-theatre-open');
  modal.querySelector('.rest-stage-close').focus({preventScroll:true});
  window.dispatchEvent(new CustomEvent('pause:companion-close'));
 }
 modal.querySelector('.rest-stage-close').addEventListener('click',close);
 modal.querySelector('.rest-stage-finish').addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
 window.PauseRestStage={open,close};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();