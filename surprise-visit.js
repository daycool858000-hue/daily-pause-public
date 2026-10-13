// A quiet second greeting, five seconds after the existing welcome is dismissed.
// Exactly one surprise per page entrance, never over the article reader or rest theatre.
(() => {
'use strict';
const messages=[
'哩賀\n有沒有人告訴過你\n你今天真的很棒',
'嘿我明白的\n你今天真的做到了\n非常厲害',
'什麼 全世界最棒的人正在看著我\n對的 就是你 不要懷疑自己',
'親愛的 你不用是誰\n你是你\n不是任何人任何角色',
'我要當第一個也可能是好幾個\n今天對你說\n你是世界上非常重要的人'
];
const defs='<defs><linearGradient id="sh" x2="1" y2="1"><stop stop-color="#f9d7c9"/><stop offset=".6" stop-color="#e7b3ac"/><stop offset="1" stop-color="#d09da0"/></linearGradient>'
+'<linearGradient id="sf" x2=".6" y2="1"><stop stop-color="#fff1df"/><stop offset=".6" stop-color="#e7d5bc"/><stop offset="1" stop-color="#c8ae95"/></linearGradient>'
+'<linearGradient id="sb" x2=".6" y2="1"><stop stop-color="#e9d3b4"/><stop offset="1" stop-color="#b9957f"/></linearGradient>'
+'<radialGradient id="sl"><stop stop-color="#fff5d8"/><stop offset="1" stop-color="#fff5d8" stop-opacity="0"/></radialGradient></defs>';
const art={
 heart:'<g class="surprise-rays" fill="none" stroke="#e4bca9" stroke-width="3" stroke-linecap="round">'
 +'<path d="M225 28v40M325 68l-25 27M363 161l-35 2M321 248l-25-25M133 251l27-29M85 156l37 7M137 64l25 27"/></g>'
 +'<g class="surprise-sparkles" fill="#e9cca0"><circle cx="93" cy="99" r="5"/><circle cx="360" cy="111" r="5"/><circle cx="137" cy="232" r="4"/><circle cx="337" cy="247" r="4"/></g>'
 +'<path class="surprise-hero-heart" d="M227 247C162 207 118 173 120 128C121 96 142 80 170 80C197 80 218 97 227 113C244 89 262 80 287 82C315 83 338 104 336 133C333 173 285 215 227 247Z" fill="url(#sh)" stroke="#d7a3a0" stroke-width="2"/>'
 +'<path d="M165 110Q149 121 152 142" fill="none" stroke="#fff1e6" stroke-width="9" stroke-linecap="round" opacity=".73"/>',
 cat:'<g class="surprise-animal surprise-cat"><path d="M127 245Q65 243 78 200Q85 181 102 191" fill="none" stroke="#ceb6a1" stroke-width="19" stroke-linecap="round"/>'
 +'<ellipse cx="226" cy="225" rx="92" ry="82" fill="url(#sf)" stroke="#d6c0a7" stroke-width="2"/>'
 +'<path d="M153 151L156 75Q157 64 168 73L208 104L246 104L289 73Q304 65 302 82L304 148Z" fill="url(#sf)" stroke="#d2b79c" stroke-width="2"/>'
 +'<path d="M168 121L168 94L190 117M289 120L289 92L268 117" fill="#ebb9ad"/>'
 +'<ellipse cx="228" cy="162" rx="81" ry="72" fill="url(#sf)"/>'
 +'<path d="M182 159Q194 150 204 159M255 159Q265 150 277 159" fill="none" stroke="#978177" stroke-width="4" stroke-linecap="round"/>'
 +'<path d="M218 176L239 176L228 188Z" fill="#c9968e"/><path d="M228 188q-10 14-21 4m21-4q11 14 21 4" stroke="#9f867a" stroke-width="3" fill="none"/>'
 +'<path d="M126 182L174 189M280 190L330 183" stroke="#baa397" stroke-width="2" opacity=".7"/>'
 +'<ellipse cx="181" cy="260" rx="26" ry="18" fill="#f2e2d0"/><ellipse cx="278" cy="260" rx="26" ry="18" fill="#f2e2d0"/></g>'
 +'<path class="surprise-offered-heart" d="M228 247C200 228 185 211 185 192Q184 166 210 166Q222 166 228 181Q241 161 260 165Q283 170 281 193Q277 221 228 247Z" fill="url(#sh)"/>',
 bear:'<g class="surprise-animal surprise-bear"><circle cx="165" cy="101" r="37" fill="url(#sb)" stroke="#c6a78d" stroke-width="2"/>'
 +'<circle cx="290" cy="101" r="37" fill="url(#sb)" stroke="#c6a78d" stroke-width="2"/>'
 +'<circle cx="165" cy="101" r="21" fill="#deb9a3"/><circle cx="290" cy="101" r="21" fill="#deb9a3"/>'
 +'<ellipse cx="228" cy="236" rx="94" ry="76" fill="url(#sb)"/>'
 +'<ellipse cx="228" cy="153" rx="100" ry="96" fill="url(#sb)" stroke="#c6a78d" stroke-width="2"/>'
 +'<circle cx="190" cy="147" r="5" fill="#73645d"/><circle cx="267" cy="147" r="5" fill="#73645d"/>'
 +'<ellipse cx="228" cy="179" rx="37" ry="26" fill="#edd5bd"/>'
 +'<path d="M215 167Q228 152 241 167Q228 181 215 167Z" fill="#8a7366"/><path d="M228 175q-8 14-19 5m19-5q8 13 18 5" stroke="#9d8374" fill="none" stroke-width="3"/>'
 +'<ellipse cx="151" cy="254" rx="28" ry="38" fill="url(#sb)" transform="rotate(-15 151 254)"/>'
 +'<ellipse cx="303" cy="254" rx="28" ry="38" fill="url(#sb)" transform="rotate(15 303 254)"/></g>'
 +'<g class="surprise-envelope"><rect x="169" y="197" width="118" height="81" rx="6" fill="#fff6e8" stroke="#c5a58f" stroke-width="2"/>'
 +'<path d="M170 199L228 240L286 199M170 275L206 237M287 275L252 237" fill="none" stroke="#d4b49d" stroke-width="3"/>'
 +'<path d="M228 237c-15-17-27-1-8 9l8 5 8-5c19-10 7-26-8-9Z" fill="#d8a3a0"/></g>'
 +'<g class="surprise-envelope-letter"><rect x="189" y="176" width="80" height="72" rx="4" fill="#fdfbf1" stroke="#d9c7b1"/>'
 +'<path d="M204 197H252M204 210H248M204 223H239" stroke="#c8b5a4" stroke-width="2"/></g>'
};
function random(max){
 if(window.crypto?.getRandomValues){const a=new Uint32Array(1);window.crypto.getRandomValues(a);return a[0]%max}
 return Math.floor(Math.random()*max);
}
function init(){
 const welcome=document.getElementById('welcomeModal');if(!welcome)return;
 const panel=document.createElement('div');panel.id='surpriseNote';panel.className='surprise-backdrop';panel.hidden=true;
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','surpriseTitle');
 panel.innerHTML='<section class="surprise-card"><button class="surprise-close" type="button" aria-label="關閉驚喜">×</button>'
 +'<p class="surprise-kicker">A LITTLE MOMENT FOR YOU</p>'
 +'<div class="surprise-stage" data-scene="heart" aria-hidden="true"></div>'
 +'<p id="surpriseTitle" class="surprise-text"></p>'
 +'<button class="surprise-dismiss" type="button">收下這份心意</button></section>';
 document.body.appendChild(panel);
 const stage=panel.querySelector('.surprise-stage'),sentence=panel.querySelector('.surprise-text');
 let seen=false,planned=false,done=false,timeout=null,focusBefore=null;
 function hide(){
  if(panel.hidden)return;
  panel.hidden=true;document.body.classList.remove('surprise-visible');
  if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
  focusBefore=null;
 }
 function show(){
  if(done||document.hidden)return;
  // Never interrupt reading or another existing modal.
  if(!welcome.hidden||!document.querySelector('#today.active')||
    document.body.classList.contains('modal-open')||
    document.body.classList.contains('rest-theatre-open')||
    !document.getElementById('articleReader')?.hidden)return;
  done=true;focusBefore=document.activeElement;
  const kind=['heart','cat','bear'][random(3)];
  stage.dataset.scene=kind;
  stage.innerHTML='<svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
   +defs+'<ellipse cx="229" cy="153" rx="174" ry="148" fill="url(#sl)"/>'
   +art[kind]+'</svg>';
  sentence.textContent=messages[random(messages.length)];
  panel.hidden=false;document.body.classList.add('surprise-visible');
  panel.querySelector('.surprise-close').focus({preventScroll:true});
  window.dispatchEvent(new CustomEvent('pause:companion-close'));
 }
 const observer=new MutationObserver(()=>{
  if(!welcome.hidden){seen=true;return}
  if(seen&&!planned){planned=true;timeout=setTimeout(show,5000)}
 });
 observer.observe(welcome,{attributes:true,attributeFilter:['hidden']});
 if(!welcome.hidden)seen=true;
 panel.querySelector('.surprise-close').addEventListener('click',hide);
 panel.querySelector('.surprise-dismiss').addEventListener('click',hide);
 panel.addEventListener('click',e=>{if(e.target===panel)hide()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)hide()});
 window.addEventListener('pagehide',()=>{clearTimeout(timeout);observer.disconnect()});
 window.PauseSurprise={hide,get hasShown(){return done}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();