// Original environmental concept art for the Garden feature.
// These bespoke illustrated landscapes are functional prototypes, not final photoreal art.
(() => {
'use strict';
const defs = `<defs>
<linearGradient id="gs-sky" x2="0" y2="1"><stop stop-color="#9dbdcb"/><stop offset=".65" stop-color="#e8ded0"/><stop offset="1" stop-color="#f3d2a8"/></linearGradient>
<linearGradient id="gs-hills" x2="0" y2="1"><stop stop-color="#a6bda4"/><stop offset="1" stop-color="#718f76"/></linearGradient>
<linearGradient id="gs-ground" x2="0" y2="1"><stop stop-color="#9ab28b"/><stop offset="1" stop-color="#527961"/></linearGradient>
<linearGradient id="gs-earth" x2="0" y2="1"><stop stop-color="#a58c6a"/><stop offset="1" stop-color="#65523d"/></linearGradient>
<linearGradient id="gs-pond" x2="0" y2="1"><stop stop-color="#a9c7c1"/><stop offset="1" stop-color="#568987"/></linearGradient>
<radialGradient id="gs-glow"><stop stop-color="#fff6cf" stop-opacity=".8"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></radialGradient>
</defs>`;
const tree=(x,y,s=1,color='#7d9d79')=>`<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0 55Q4-48-18-106M0-40Q31-68 45-101" fill="none" stroke="#786655" stroke-width="17" stroke-linecap="round"/>
<ellipse cx="-35" cy="-90" rx="65" ry="56" fill="${color}"/><ellipse cx="41" cy="-119" rx="72" ry="62" fill="${color}"/>
<ellipse cx="-5" cy="-146" rx="72" ry="62" fill="${color}"/>
<ellipse cx="-38" cy="-116" rx="38" ry="22" fill="#e7dfc2" opacity=".13"/></g>`;
const flower=(x,y,n,c)=>`<g transform="translate(${x} ${y}) scale(${n})">
<path d="M0 29Q-4 2 0-15" stroke="#638d5c" stroke-width="3" fill="none"/>
<path d="M0 17Q-15 5-18 12Q-11 21 0 17M0 10Q18-3 22 6Q13 18 0 10" fill="#7ca078"/>
${Array.from({length:5},(_,i)=>`<ellipse cx="0" cy="-16" rx="7" ry="17" transform="rotate(${i*72} 0 -16)" fill="${c}"/>`).join('')}
<circle cx="0" cy="-16" r="6" fill="#eac67b"/></g>`;
const base=`<rect width="960" height="630" fill="url(#gs-sky)"/>
<ellipse cx="732" cy="160" rx="310" ry="260" fill="url(#gs-glow)"/>
<g fill="#fff8ee" opacity=".31"><ellipse cx="197" cy="132" rx="124" ry="25"/><ellipse cx="266" cy="111" rx="90" ry="33"/></g>
<path d="M0 391Q157 278 317 357Q493 246 655 353Q818 283 960 340V630H0Z" fill="#a9b7a1"/>
<path d="M0 442Q157 379 331 413Q505 341 690 402Q821 352 960 403V630H0Z" fill="url(#gs-hills)"/>`;
const garden=()=>{
let blooms='';
for(let i=0;i<60;i++){const x=24+i%12*78+Math.floor(i/12)%2*24,y=447+Math.floor(i/12)*33;
  blooms+=flower(x,y,.43+Math.floor(i/12)*.09,['#e6b5ab','#e8d6c3','#dfb4c4','#efc7a0'][i%4]);}
return base+`<path d="M0 445Q240 404 475 426Q744 385 960 430V630H0Z" fill="url(#gs-ground)"/>
<path d="M418 630Q482 503 490 433Q522 418 544 445Q535 529 613 630Z" fill="#d5bd9d"/>
<path d="M439 630Q498 494 499 433" stroke="#f7e9cc" stroke-width="4" opacity=".6" fill="none"/>
${tree(94,377,.72)}${tree(887,388,.68,'#bbaca3')}
${blooms}<g fill="none" stroke="#a68b6d" stroke-width="9"><path d="M636 422V315Q702 245 772 315V422"/><path d="M646 317Q702 267 760 317" stroke-width="3"/></g>`;};
const farm=()=>{
let rows='',lines='';
for(let r=0;r<7;r++){
const y=438+r*29;
for(let j=0;j<27-r*2;j++){
const x=19+j*(970/(27-r*2));
rows+=`<g transform="translate(${x.toFixed(0)} ${y}) scale(${(.3+r*.13).toFixed(2)})"><path d="M0 10V-29M0-10Q-19-40-25-37Q-17-13 0-10M0-15Q24-39 26-34Q26-18 0-15" stroke="#5d8751" stroke-width="4" fill="#739e69"/></g>`;
}
}
for(let i=0;i<11;i++)lines+=`<path d="M${(i-5)*25+480} 425L${(i-5)*105+480} 632" stroke="#66543e" stroke-width="3" opacity=".35"/>`;
return base+`<path d="M0 418Q290 398 500 419Q730 391 960 418V630H0Z" fill="#839f64"/>
<path d="M0 630L387 419H582L960 630Z" fill="url(#gs-earth)" opacity=".91"/>
${lines}${rows}
<g transform="translate(735 354)"><rect x="-73" y="-16" width="146" height="89" fill="#bb896e" stroke="#96745f" stroke-width="3"/>
<path d="M-87-16L-5-88L90-16" fill="#806f61" stroke="#68584f" stroke-width="5"/>
<rect x="-22" y="15" width="44" height="58" fill="#786655"/>
<path d="M-22 15L22 73M22 15L-22 73" stroke="#ba9e83" stroke-width="3"/>
<rect x="-60" y="5" width="24" height="25" fill="#e4d4b5" stroke="#998169" stroke-width="4"/></g>
${tree(112,392,.55)}`;};
const park=()=>{
let dots='';for(let i=0;i<70;i++){dots+=`<ellipse cx="${i*127%960}" cy="${490+(i*37%134)}" rx="3" ry="2" fill="${i%2?'#c8bd89':'#a6b68b'}" opacity=".65"/>`;}
return base+`<path d="M0 437Q300 382 508 415Q740 370 960 426V630H0Z" fill="url(#gs-ground)"/>
<path d="M205 646Q278 513 409 462Q480 441 510 421" stroke="#cdbb9f" stroke-width="112" fill="none"/>
<path d="M205 646Q278 513 409 462Q480 441 510 421" stroke="#efe1c6" stroke-width="3" fill="none" opacity=".6"/>
<ellipse cx="762" cy="502" rx="175" ry="77" fill="#698d84"/><ellipse cx="762" cy="489" rx="173" ry="57" fill="url(#gs-pond)"/>
<path d="M650 485Q758 501 863 484M687 509Q766 516 838 506" stroke="#e8e9d6" stroke-width="2" fill="none" opacity=".56"/>
${tree(100,395,.83)}${tree(890,392,.75)}${tree(534,409,.32,'#d7b4b8')}
<g transform="translate(463 474)" fill="none" stroke="#9a775c" stroke-width="9" stroke-linecap="round">
<path d="M-48-28h96M-47-9h94M-40 7h80"/><path d="M-37-6l-13 56M38-6l14 56" stroke="#65584b" stroke-width="7"/></g>
${dots}<g stroke="#f8f1de" stroke-width="2.5" fill="none"><path d="M697 304q15-13 28 0q11-13 26 0"/></g>`;};
const drawings={flowers:garden,farm,park};
function draw(area){const paint=drawings[area];return paint?
`<svg xmlns="http://www.w3.org/2000/svg" class="garden-environment-art" viewBox="0 0 960 630" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${paint()}</svg>`:'';}
function thumbnail(area){const svg=draw(area);return svg?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg):null;}
window.PauseGardenScenes={draw,thumbnail};
})();
