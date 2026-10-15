(function moodSceneModule(){
'use strict';
const entries=[
 ['安靜','quiet-nook','room','#edddc7','#8fab9b'],
 ['疲倦','rain-bedroom','room','#cec7c0','#8ca5ae'],
 ['悶住','half-open-window','room','#cdc8be','#b0b7b2'],
 ['混亂','crossing-trails','mountain','#d8cabb','#8ea8a4'],
 ['想哭','rainy-window','room','#cad5da','#98aab7'],
 ['孤單','lone-balcony','night','#adbbc9','#627b9b'],
 ['想被陪著','two-seats','room','#ead4bf','#b2b8a5'],
 ['想躲起來','reading-cubby','library','#d9cab6','#9fa998'],
 ['煩躁','windswept-terrace','coast','#dbc7b2','#9cadaa'],
 ['害怕','safe-bedroom','room','#ddc9bc','#aeada0'],
 ['想念','distant-lamp','lake','#d7cfbd','#8da7ad'],
 ['心裡很滿','wildflower-courtyard','garden','#ecd2bb','#8aa78d'],
 ['希望','first-valley-light','mountain','#f1dbb5','#a6b89a'],
 ['期待','open-terrace','coast','#f3d9b6','#8aabae'],
 ['放空','cloud-pasture','sky','#e0e7e2','#a6b9b2'],
 ['好奇','fern-path','forest','#d3d6bb','#779a86'],
 ['安心','library-armchair','library','#e8d7bc','#99aa9a'],
 ['溫柔','tea-and-flowers','room','#edcdbf','#acb6ab'],
 ['想重新開始','open-garden-door','room','#eedbc0','#a2bba0'],
 ['想看海','sandy-beach','coast','#e8d9bf','#8ebcc0'],
 ['想接近自然','creek-ferns','forest','#d0dac4','#6c9681'],
 ['需要勇氣','ridge-steps','mountain','#ded1bc','#8c9e9e'],
 ['想慢一點','still-boat','lake','#d7ded2','#92b3b8'],
 ['想暖一點','fireplace-corner','room','#edd1af','#ac9b87']
];
const byName=Object.fromEntries(entries.map(([name,key,type,warm,green],index)=>[name,{name,key,type,warm,green,index}]));
const defs=`<defs>
 <linearGradient id="ms-sky" x2=".12" y2="1"><stop stop-color="#b2ced2"/><stop offset=".55" stop-color="#e2e5d9"/><stop offset="1" stop-color="#ead1b4"/></linearGradient>
 <linearGradient id="ms-water" x2="0" y2="1"><stop stop-color="#9fc2c3"/><stop offset=".7" stop-color="#759fa6"/><stop offset="1" stop-color="#577d86"/></linearGradient>
 <linearGradient id="ms-wall" x2=".2" y2="1"><stop stop-color="#f4ebda"/><stop offset="1" stop-color="#c5af99"/></linearGradient>
 <linearGradient id="ms-floor" x2=".2" y2="1"><stop stop-color="#bfa68d"/><stop offset="1" stop-color="#736050"/></linearGradient>
 <linearGradient id="ms-cloth" x2=".12" y2="1"><stop stop-color="#eee5d5"/><stop offset="1" stop-color="#879d90"/></linearGradient>
 <linearGradient id="ms-wood" x2="0" y2="1"><stop stop-color="#bfa78b"/><stop offset="1" stop-color="#856852"/></linearGradient>
 <linearGradient id="ms-leaf" x2="0" y2="1"><stop stop-color="#bdd3b2"/><stop offset="1" stop-color="#58856c"/></linearGradient>
 <radialGradient id="ms-sun"><stop stop-color="#ffefc0" stop-opacity=".96"/><stop offset=".42" stop-color="#fff0cf" stop-opacity=".41"/><stop offset="1" stop-color="#fff5de" stop-opacity="0"/></radialGradient>
 <radialGradient id="ms-vignette"><stop offset=".55" stop-color="#17222b" stop-opacity="0"/><stop offset="1" stop-color="#17222b" stop-opacity=".16"/></radialGradient>
 <filter id="ms-grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="9" stitchTiles="stitch"/></filter>
 <filter id="ms-soft"><feGaussianBlur stdDeviation="7"/></filter>
</defs>`;
const flower=(x,y,color,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 17Q-6-11 1-37" stroke="#6e9670" stroke-width="3" fill="none"/><path d="M0 9q-21-21-19-31q16-4 19 31M0-12q18-22 22-17q3 13-22 17" fill="#8daa87"/><g fill="${color}">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-30" rx="8" ry="15" transform="rotate(${a} 0 -30)"/>`).join('')}</g><circle cy="-30" r="6" fill="#e8c67b"/></g>`;
const tree=(x,y,size,color='#789c80')=>`<g transform="translate(${x} ${y}) scale(${size})"><path d="M0 20Q-5-64-20-130M0-51Q27-92 41-116" stroke="#826d57" stroke-width="17" fill="none"/><ellipse cx="-44" cy="-111" rx="66" ry="56" fill="${color}"/><ellipse cx="34" cy="-139" rx="73" ry="66" fill="${color}"/><ellipse cx="-9" cy="-176" rx="77" ry="60" fill="${color}"/><ellipse cx="-47" cy="-138" rx="29" ry="15" fill="#edf2d8" opacity=".15"/></g>`;
const chair=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="2" cy="70" rx="76" ry="17" fill="#453a31" opacity=".12" filter="url(#ms-soft)"/><rect x="-49" y="-61" width="98" height="86" rx="21" fill="url(#ms-cloth)" stroke="#b1aa97" stroke-width="3"/><rect x="-59" y="-2" width="118" height="61" rx="17" fill="#b4b7a8"/><path d="M-33 60v40m66-40v40" stroke="#836a56" stroke-width="9"/></g>`;
const lamp=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cy="-50" rx="118" ry="150" fill="url(#ms-sun)"/><path d="M0 90V-66" stroke="#806d56" stroke-width="8"/><path d="M-39-63Q0-159 39-63Z" fill="#ead4af"/><ellipse cy="91" rx="24" ry="7" fill="#806d56"/></g>`;
const cup=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cy="15" rx="23" ry="5" fill="#dccbb3"/><path d="M-18-5h36v24q-18 13-36 0Z" fill="#f4eada" stroke="#cbb6a3" stroke-width="2"/><path d="M18-1q20-4 15 13q-4 8-15 4" fill="none" stroke="#eee1ca" stroke-width="5"/><path d="M-6-12q-12-14 0-26m15 26q-11-15 3-25" stroke="#ebddca" opacity=".6" stroke-width="3" fill="none"/></g>`;
const plant=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-27 10h54l-9 64h-36Z" fill="#b68e72"/><ellipse cy="10" rx="27" ry="8" fill="#c7a285"/><path d="M0 12V-99M0-17Q-47-42-48-62M0-57Q28-85 43-102" stroke="#62866c" stroke-width="5" fill="none"/><path d="M0-50Q-70-110-59-59q29 20 59 9M0-77Q51-135 60-78q-29 27-60 1M0-17Q60-62 58-19q-25 27-58 2" fill="url(#ms-leaf)"/></g>`;
function outdoors(s){
 const {type,key,index}=s;let shape=`<rect width="960" height="630" fill="url(#ms-sky)"/>
 <ellipse cx="${index%2?745:245}" cy="${index%2?156:170}" rx="290" ry="260" fill="url(#ms-sun)"/>
 <g fill="#fff9eb" opacity=".31"><ellipse cx="203" cy="147" rx="153" ry="27"/><ellipse cx="306" cy="123" rx="91" ry="34"/><ellipse cx="747" cy="251" rx="120" ry="18"/></g>
 <path d="M0 382Q147 269 284 353Q448 251 591 349Q755 272 960 371V630H0Z" fill="#b0c1ae"/>
 <path d="M0 440Q178 374 337 425Q546 333 739 412Q878 375 960 417V630H0Z" fill="#8caa92"/>`;
 if(type==='coast'){
 shape+=`<path d="M0 368Q287 344 491 369Q714 348 960 359V630H0Z" fill="url(#ms-water)"/>
 <path d="M0 555Q232 465 479 530Q701 566 960 503V630H0Z" fill="#dfc9a8"/><path d="M0 555Q223 491 480 534Q722 567 960 501" stroke="#fff8e7" stroke-width="11" fill="none" opacity=".69"/>
 <path d="M100 447q72-16 138-7m304 10q78-18 170-6" stroke="#edf2eb" opacity=".65" stroke-width="3" fill="none"/>`;
 if(key==='windswept-terrace'||key==='open-terrace'){
 shape+=`<path d="M0 495H960V630H0Z" fill="#c5a88b"/><path d="M0 495H960" stroke="#f6e5cc" stroke-width="11"/>
 <path d="M43 492V388M252 492V388M471 492V388M691 492V388M920 492V388M45 416H920" fill="none" stroke="#867c72" stroke-width="11"/>`;
 if(key==='windswept-terrace')shape+=plant(148,485)+`<path d="M714 560q75-35 151 0" stroke="#d9ccb5" stroke-width="24" fill="none"/>`;
 else shape+=`<ellipse cx="718" cy="565" rx="92" ry="20" fill="#3e483e" opacity=".13"/><rect x="667" y="543" width="104" height="16" fill="url(#ms-wood)" rx="6"/><path d="M682 560l-16 65m89-65 16 65" stroke="#816d56" stroke-width="9"/>`;
 }
 if(key==='sandy-beach')shape+=`<path d="M0 593q198-45 382 6q311-54 578-20V630H0Z" fill="#e9dab7"/><path d="M776 580l-22 39m22-39q-35-58-77-19q40 26 77 19q15-59 62-43q-11 46-62 43" fill="#7f9c83" stroke="#709078" stroke-width="3"/>`;
 }
 if(type==='lake'){
 shape+=`<path d="M0 382Q302 362 530 390Q751 373 960 386V630H0Z" fill="url(#ms-water)"/>
 <path d="M0 438Q314 419 571 437Q794 425 960 436M0 501Q312 492 534 502Q795 487 960 501" stroke="#dfe9db" stroke-width="3" opacity=".4" fill="none"/>${tree(82,438,.59)}${tree(895,437,.63)}`;
 if(key==='still-boat')shape+=`<g transform="translate(521 520)"><path d="M-114 0Q-43 51 63 32L116-8Z" fill="#8b6c56"/><path d="M-106-6H108" stroke="#d8bda1" stroke-width="6"/><path d="M-7-2V-127" stroke="#94775e" stroke-width="6"/><path d="M0-117L0-4L72-7Z" fill="#f2e9d5"/></g>`;
 else shape+=`<path d="M198 555V418m-43 1h91" stroke="#6f5c4c" stroke-width="12"/><path d="M155 418Q196 335 245 418Z" fill="#e8d1a1"/><ellipse cx="197" cy="424" rx="84" ry="122" fill="url(#ms-sun)" opacity=".5"/>`;
 }
 if(type==='mountain'){
 shape+=`<path d="M0 403 147 233 249 366 422 117 568 350 762 198 960 397V630H0Z" fill="#91a8a8"/>
 <path d="M316 277 422 117 532 277l-86-56-34 33-41-31Z" fill="#f2e8d9" opacity=".87"/>
 <path d="M0 466Q237 386 469 443Q709 381 960 446V630H0Z" fill="#789b88"/>
 <path d="M408 630Q507 500 478 371Q553 500 652 630" fill="#c5b294" opacity=".83"/>`;
 if(key==='ridge-steps')shape+=Array.from({length:6},(_,i)=>`<path d="M${398-i*30} ${529+i*17}h${135+i*42}l${15+i*5} 18h-${165+i*47}Z" fill="#d7c5a7" stroke="#aa9477" stroke-width="3"/>`).join('');
 if(key==='crossing-trails')shape+=`<path d="M60 630Q393 463 570 439Q715 382 877 394M912 630Q663 486 533 417Q274 343 112 412" stroke="#ceb99f" stroke-width="46" opacity=".66" fill="none"/>`;
 if(key==='first-valley-light')shape+=`<path d="M0 558q320-69 520-22q287-63 440 8V630H0Z" fill="#c4b89d"/><path d="M479 630q74-128 133-198" stroke="#f0dcb9" stroke-width="47" opacity=".7" fill="none"/>`;
 }
 if(type==='forest'){
 shape+=`<path d="M0 434Q214 369 431 419Q704 359 960 420V630H0Z" fill="#65886e"/>
 ${tree(111,423,1.09,'#54876a')}${tree(851,438,.94,'#618d70')}${tree(318,403,.65)}${tree(732,408,.6)}`;
 if(key==='creek-ferns')shape+=`<path d="M363 630Q423 519 517 453Q542 518 607 630Z" fill="#8ab6b3"/><path d="M395 618Q470 517 515 467" stroke="#f0e5d6" stroke-width="5" opacity=".57" fill="none"/>`;
 else shape+=`<path d="M424 630Q474 542 533 411Q552 544 638 630Z" fill="#b8b89d"/>${flower(221,551,'#d7b1b3',.74)}${flower(780,545,'#edd1af',.66)}`;
 }
 if(type==='garden'){
 shape+=`<path d="M0 415Q241 371 475 417Q738 364 960 424V630H0Z" fill="#83a479"/>
 <path d="M414 630Q471 505 488 422Q532 525 598 630Z" fill="#dfc9a7"/>${tree(105,398,.79)}${tree(860,394,.72)}`;
 for(let i=0;i<75;i++)shape+=flower(22+i%15*65,451+Math.floor(i/15)*34,['#dbabb4','#eed5bf','#dec0ca','#edc7a9'][i%4],.38+i%5*.045);
 }
 if(type==='sky'){
 shape+=`<path d="M0 508Q299 466 528 505Q735 464 960 509V630H0Z" fill="#adbea9"/><path d="M0 561Q225 515 455 557Q718 523 960 554V630H0Z" fill="#97ae99"/><g fill="#fff9ed" opacity=".46"><ellipse cx="344" cy="240" rx="200" ry="38"/><ellipse cx="708" cy="318" rx="190" ry="31"/></g>`;
 }
 if(type==='night')shape+=`<rect width="960" height="630" fill="#1e314d" opacity=".69"/><ellipse cx="738" cy="152" rx="42" ry="42" fill="#ede5cc"/><path d="M0 527h960v103H0Z" fill="#5e6570"/>
 <path d="M0 522V394m220 128V394m220 128V394m220 128V394m220 128V394M0 413h960" stroke="#9a9d93" stroke-width="13"/>
 <path d="M105 516h145v20H105Z" fill="#978c7b"/>${lamp(631,435)}`;
 return shape;
}
function indoor(s){
 let body=`<rect width="960" height="630" fill="url(#ms-wall)"/>
 <path d="M0 418Q478 402 960 416V630H0Z" fill="url(#ms-floor)"/>
 <path d="M0 420H960" stroke="#ac9277" stroke-width="15"/>
 <path d="M0 630L414 422M960 630L539 422" stroke="#775b48" opacity=".27" stroke-width="2"/>
 <rect x="73" y="56" width="493" height="358" rx="12" fill="#c1ad95" stroke="#e8dbca" stroke-width="16"/>
 <rect x="96" y="78" width="450" height="314" fill="url(#ms-sky)"/>`;
 if(['rain-bedroom','half-open-window','rainy-window'].includes(s.key))body+=`<path d="M96 295Q303 207 546 279V392H96Z" fill="#90a6a6"/><path d="M140 98L121 193m118-73-17 135m107-145-25 121m138-114-19 143" stroke="#e9f0e5" opacity=".7" stroke-width="4"/>`;
 else if(s.key==='fireplace-corner')body+=`<path d="M96 293Q280 213 546 278V392H96Z" fill="#6e828f"/><ellipse cx="443" cy="141" rx="40" ry="40" fill="#f0e3c7"/>`;
 else body+=`<path d="M96 297Q280 226 546 277V392H96Z" fill="#96b29c"/><ellipse cx="420" cy="159" rx="129" ry="121" fill="url(#ms-sun)"/>`;
 body+=`<path d="M320 78V392M96 236H546" stroke="#e3ddce" stroke-width="15"/><path d="M68 407h512" stroke="#b9a086" stroke-width="23"/><path d="M71 84Q153 73 200 123V383Q112 405 71 397" fill="#e4d1bc" opacity=".7"/>
 <rect x="629" y="302" width="242" height="14" rx="5" fill="#95795f"/><path d="M663 315v155m168-155v155" stroke="#89715a" stroke-width="12"/>`;
 if(s.key==='quiet-nook')body+=chair(258,477)+plant(793,410)+cup(735,291);
 if(['rain-bedroom','safe-bedroom'].includes(s.key)){
 body+=`<rect x="392" y="386" width="454" height="154" rx="30" fill="#a69688"/><rect x="375" y="448" width="488" height="135" rx="34" fill="url(#ms-cloth)"/><rect x="422" y="414" width="133" height="54" rx="19" fill="#ede2d4"/><path d="M397 516Q621 490 846 532" stroke="#f4e9da" stroke-width="6" opacity=".55" fill="none"/>`;
 if(s.key==='safe-bedroom')body+=lamp(839,361)+`<rect x="27" y="140" width="41" height="286" rx="6" fill="#b09a82"/><circle cx="51" cy="280" r="7" fill="#ead5b1"/>`;
 }
 if(s.key==='half-open-window')body+=`<path d="M321 79L307 393 549 372V86Z" fill="#d6e0d6" stroke="#eee6d7" stroke-width="8" opacity=".4"/>`+chair(744,477)+plant(877,432);
 if(s.key==='rainy-window')body+=chair(749,483)+lamp(853,352)+cup(680,304);
 if(s.key==='two-seats')body+=chair(269,487)+chair(497,488)+lamp(831,359)+cup(736,286);
 if(['reading-cubby','library-armchair'].includes(s.key)){
 body+=Array.from({length:3},(_,i)=>`<rect x="${559+i*102}" y="84" width="93" height="340" fill="#a08b72" stroke="#7b6754" stroke-width="5"/>`).join('');
 body+=Array.from({length:30},(_,i)=>`<rect x="${566+(i%6)*49}" y="${113+Math.floor(i/6)*60}" width="${27+i%3*6}" height="50" rx="2" fill="${['#b9b9aa','#aa876f','#c9b48f','#879e90'][i%4]}"/>`).join('');
 body+=chair(303,478)+lamp(833,373);
 }
 if(s.key==='soft-living-room'){
 body+=`<ellipse cx="486" cy="553" rx="335" ry="82" fill="#d4c7af" opacity=".72"/>
 <ellipse cx="486" cy="551" rx="307" ry="70" fill="none" stroke="#efdfc7" stroke-width="8" opacity=".78"/>
 <rect x="233" y="326" width="506" height="167" rx="46" fill="#a8b6a6" stroke="#879c8d" stroke-width="5"/>
 <rect x="208" y="397" width="552" height="132" rx="42" fill="url(#ms-cloth)" stroke="#a3aa9c" stroke-width="5"/>
 <rect x="230" y="438" width="514" height="97" rx="34" fill="#bdc0b4"/>
 <rect x="246" y="353" width="143" height="89" rx="23" fill="#d6c8b8"/>
 <rect x="580" y="348" width="143" height="89" rx="23" fill="#d8d4c4"/>
 <path d="M245 530l-13 51m494-51 13 51" stroke="#786958" stroke-width="15"/>
 <ellipse cx="490" cy="570" rx="151" ry="18" fill="#423f35" opacity=".13"/>
 <ellipse cx="492" cy="529" rx="139" ry="31" fill="url(#ms-wood)"/>
 <path d="M404 539l-15 74m199-74 15 74" stroke="#92775b" stroke-width="14"/>
 <path d="M610 276q31 0 39-36h125q13 37 44 37" stroke="#b5a992" stroke-width="12" fill="none"/>
 <rect x="680" y="111" width="127" height="135" rx="5" fill="#a9bcae" stroke="#e8d5b9" stroke-width="13"/>
 <path d="M687 194q40-39 116-24" stroke="#e0edda" stroke-width="7" fill="none" opacity=".5"/>`;
 body+=lamp(858,348)+plant(116,411)+cup(485,503);
 }
 if(s.key==='tea-and-flowers')body+=chair(269,478)+cup(715,300)+plant(852,424)+flower(756,225,'#dbaeb8',.8)+flower(789,217,'#eccdbf',.62);
 if(s.key==='open-garden-door')body+=`<path d="M118 74V414L9 504V74Z" fill="#a99478" stroke="#7c6550" stroke-width="12"/><path d="M140 105V410l-92 52V105Z" fill="#aec6b2" opacity=".62"/><path d="M125 480Q353 454 551 424l177 206H183Z" fill="#dcc6a4" opacity=".8"/>`+plant(853,430);
 if(s.key==='fireplace-corner')body+=`<rect x="611" y="233" width="263" height="271" rx="12" fill="#ac9481" stroke="#dac8b3" stroke-width="15"/><path d="M648 480V326h183v154Z" fill="#645148"/><path d="M730 475q-75-98-9-116q-16 58 37 68q-28-95 24-104q-10 80 27 101q-24 74-79 51Z" fill="#f5bc66"/><ellipse cx="747" cy="427" rx="143" ry="174" fill="url(#ms-sun)" opacity=".56"/>`+chair(282,478)+cup(529,310);
 return body;
}
function svg(name){
 const s=byName[name];if(!s)return '';
 const body=['room','library'].includes(s.type)?indoor(s):outdoors(s);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="630" viewBox="0 0 960 630" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${name}的專屬畫布">${defs}<rect width="960" height="630" fill="${s.warm}"/>${body}<rect width="960" height="630" fill="${s.green}" opacity=".03"/><rect width="960" height="630" fill="#fff5e8" filter="url(#ms-grain)" opacity=".066"/><rect width="960" height="630" fill="url(#ms-vignette)"/></svg>`;
}
function livingRoomSvg(){
 const scene={key:'soft-living-room',type:'room',index:25,warm:'#ead9c5',green:'#aebcae'};
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="630" viewBox="0 0 960 630"
 preserveAspectRatio="xMidYMid slice" role="img" aria-label="明亮的獨立客廳景觀">${defs}
 <rect width="960" height="630" fill="#ebdfce"/>${indoor(scene)}
 <rect width="960" height="630" fill="#fff3e2" filter="url(#ms-grain)" opacity=".05"/>
 <rect width="960" height="630" fill="url(#ms-vignette)"/></svg>`;
}
function livingRoomUrl(){
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(livingRoomSvg());
}
// Site-owned AI-generated scenes already in the repository. Assign at most
// one photograph per emotion: never swap labels onto the same photo.
const realisticMoodScenes=Object.freeze({
  // Distinct first-pass interiors; no two moods are assigned the same photograph.
  '安靜':'./media/generated/palette-morning-bedroom-v1.webp',
  '想被陪著':'./media/generated/palette-warm-living-room-v1.webp',
  '想哭':'./media/generated/palette-rain-window-v1.webp',
  '想躲起來':'./media/generated/palette-quiet-study-v1.webp',
  '放空':'./media/generated/palette-cloud-v1.webp',
  '心裡很滿':'./media/generated/scene-04.webp',
  '想慢一點':'./media/generated/scene-06.webp',
  '孤單':'./media/generated/scene-07.webp',
  '想念':'./media/generated/scene-01.webp',
  '希望':'./media/generated/palette-sunrise-v1.webp',
  '期待':'./media/generated/palette-balcony-v1.webp',
  // Indoor moods stay on their matching room/library compositions until
  // independently usable indoor image assets have been reviewed.
  // Do not present garden photographs or flower close-ups as living rooms.
  // '好奇' similarly awaits its fern-path scene rather than a greenhouse photo.
  '想看海':'./media/generated/scene-02.webp',
  '想接近自然':'./media/generated/scene-03.webp'
});
const cache=new Map();
function imageUrl(name){
 if(realisticMoodScenes[name])return realisticMoodScenes[name];
 if(!cache.has(name)){const source=svg(name);if(!source)return null;cache.set(name,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(source));}
 return cache.get(name);
}
window.PauseMoodScenes={entries,byName,svg,imageUrl,livingRoomSvg,livingRoomUrl,realisticMoodScenes};
})();