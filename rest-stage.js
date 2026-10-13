// Rest experiences have distinct visual responses; this is a quiet interaction, not guided treatment.
(() => {
 const states=[
 ['看窗外','window','窗外的光'],['放鬆手指','hands','手指慢慢鬆開'],
 ['環境聲音','sound','留一點位置給聲音'],['一口水','cup','杯中的水光'],
 ['舒服的位置','chair','安穩的位置'],['看遠方','hills','讓視線走遠'],
 ['光影','sunlight','光影慢慢移動'],['閉眼','eyes','暫時閉上眼睛'],
 ['伸展','stretch','一段伸展'],['手機','phone','讓訊息安靜'],
 ['微笑','flower','很小的好事'],['小角落','desk','清出一小塊地方'],
 ['花或一片葉子','leaf','一片葉子的時間'],['問題','paper','把疑問留給紙張'],
 ['收尾','night','今天的收尾']
 ];
 const drawing={
 window:'<rect x="115" y="48" width="230" height="234" rx="7" fill="#c9d5cd"/><path d="M115 220Q191 120 265 210T345 192V280H115Z" fill="#92ada0"/><path d="M230 48V282M115 164H345" stroke="#f7ecda" stroke-width="13"/><path class="rest-drift" d="M87 49Q144 111 111 276H51Q85 183 54 49Z" fill="#ebd6c4"/><path class="rest-drift" d="M373 49Q337 119 360 276H400Q373 192 407 49Z" fill="#e6c9b7"/>',
 hands:'<path class="rest-soft" d="M154 310Q99 243 116 213L150 149Q165 131 176 154L181 194L199 101Q203 83 218 91L228 190L250 75Q263 60 274 79L270 202L299 116Q309 96 322 112L303 235Q318 274 283 308Z" fill="#d9aa95" stroke="#b98b7d" stroke-width="5"/><path d="M100 325Q208 349 336 315" fill="none" stroke="#edd0bc" stroke-width="10" stroke-linecap="round"/>',
 sound:'<path d="M162 135V257L99 219H70V170H100Z" fill="#b8a994"/><path class="rest-sound" d="M196 163Q257 199 197 238M213 128Q317 196 212 267M232 98Q380 195 232 302" fill="none" stroke="#a0b5ab" stroke-width="9" stroke-linecap="round"/>',
 cup:'<ellipse cx="225" cy="302" rx="130" ry="20" fill="#d0bdb0"/><path d="M144 147H291L274 283Q220 307 162 279Z" fill="#c6a18a"/><path class="rest-water" d="M153 184Q217 171 284 184L266 272Q220 290 173 267Z" fill="#83b5b9"/><path d="M290 166Q373 150 335 239Q315 259 283 250" fill="none" stroke="#c7a48a" stroke-width="19"/><ellipse cx="217" cy="147" rx="74" ry="18" fill="#e9daca"/>',
 chair:'<rect x="142" y="106" width="175" height="141" rx="29" fill="#b1b9a5"/><path d="M125 231H334V291Q224 308 125 286Z" fill="#d2c2af"/><path d="M153 279L148 353M306 281L313 353" stroke="#806c5e" stroke-width="14" stroke-linecap="round"/><rect x="180" y="170" width="110" height="65" rx="14" fill="#dfc7ba"/>',
 hills:'<circle cx="320" cy="96" r="44" fill="#e9cca5"/><path d="M0 282L107 180L188 267L290 145L440 285V380H0Z" fill="#9bb4ab"/><path class="rest-drift" d="M0 325Q105 258 213 317T440 300V380H0Z" fill="#648f85"/><path d="M0 351Q190 309 440 348" fill="none" stroke="#dfd9c3" stroke-width="8"/>',
 sunlight:'<rect x="79" y="62" width="280" height="242" rx="5" fill="#d7dbce"/><path d="M219 62V304M79 185H359" stroke="#f0e4d5" stroke-width="14"/><path class="rest-sunbeam" d="M220 90L385 335H116Z" fill="#f2d3a5" opacity=".55"/><circle cx="275" cy="132" r="34" fill="#f2d3a5"/>',
 eyes:'<path class="rest-eyes" d="M78 192Q145 120 212 192Q145 256 78 192ZM233 192Q302 120 370 192Q302 257 233 192Z" fill="#f0e2d4" stroke="#bc9c8d" stroke-width="6"/><path d="M93 204Q147 230 198 204M249 204Q302 230 353 204" fill="none" stroke="#ae9587" stroke-width="5" stroke-linecap="round"/>',
 stretch:'<circle cx="217" cy="88" r="30" fill="#d3ac99"/><path class="rest-soft" d="M217 118L215 256M216 165L128 208M215 166L302 96M214 257L152 326M214 255L273 332" stroke="#b49d8b" stroke-width="17" stroke-linecap="round" fill="none"/><path d="M88 330H351" stroke="#d6bba5" stroke-width="7" stroke-linecap="round"/>',
 phone:'<rect x="155" y="60" width="146" height="265" rx="22" fill="#a69c94"/><rect x="167" y="80" width="122" height="221" rx="12" fill="#d5dfd8"/><path class="rest-drift" d="M203 169Q228 142 254 169M193 194Q226 226 264 191" stroke="#95b2a6" stroke-width="8" fill="none"/><circle cx="228" cy="310" r="5" fill="#e8d9c5"/>',
 flower:'<path d="M221 329Q211 261 223 185" fill="none" stroke="#789986" stroke-width="10"/><path d="M221 242Q157 181 132 211Q173 271 221 242ZM219 270Q281 213 307 237Q273 294 219 270Z" fill="#a4b89a"/><g class="rest-soft" fill="#dcb6a5"><ellipse cx="221" cy="124" rx="32" ry="60"/><ellipse cx="221" cy="124" rx="32" ry="60" transform="rotate(72 221 165)"/><ellipse cx="221" cy="124" rx="32" ry="60" transform="rotate(-72 221 165)"/></g><circle cx="221" cy="160" r="24" fill="#f1d59e"/>',
 desk:'<path d="M64 257H375V276H64Z" fill="#a7806a"/><path d="M89 270V352M347 271V352" stroke="#a7806a" stroke-width="15"/><g class="rest-drift"><rect x="145" y="182" width="160" height="70" rx="3" fill="#eee6d8" transform="rotate(-5 225 218)"/><path d="M173 209H265M175 225H252" stroke="#c3ada0" stroke-width="3"/></g><path d="M105 213H143L137 255H113Z" fill="#d1a58f"/><path d="M122 214L122 147" stroke="#8fa58e" stroke-width="5"/><ellipse cx="109" cy="174" rx="12" ry="31" fill="#a2b798" transform="rotate(-34 109 174)"/>',
 leaf:'<path d="M222 330L222 155" fill="none" stroke="#8a9a78" stroke-width="8"/><path class="rest-leaf" d="M228 177Q76 77 96 227Q179 279 228 177Z" fill="#8eab89"/><path class="rest-leaf" d="M221 229Q374 105 354 264Q269 307 221 229Z" fill="#afc3a0"/><path d="M221 190L117 200M221 239L336 244" stroke="#e1dfb9" stroke-width="3"/>',
 paper:'<rect class="rest-drift" x="111" y="55" width="222" height="268" rx="5" fill="#f8eedf" transform="rotate(-3 222 189)"/><path d="M156 113H292M159 140H287M164 168H299M165 202H284" stroke="#cdbbae" stroke-width="3"/><path d="M220 266Q200 228 223 214Q247 203 246 224Q248 240 223 248V255" fill="none" stroke="#a0b4a0" stroke-width="7"/><circle cx="222" cy="272" r="5" fill="#a0b4a0"/>',
 night:'<path d="M0 298Q123 250 217 287T440 269V380H0Z" fill="#7a908e"/><circle cx="296" cy="107" r="49" fill="#ecd6b9"/><circle cx="316" cy="85" r="49" fill="#adb8af"/><g class="rest-stars" fill="#f5e9cd"><circle cx="76" cy="98" r="4"/><circle cx="132" cy="159" r="3"/><circle cx="363" cy="207" r="4"/><circle cx="205" cy="84" r="3"/></g>'
 };

 // Each rest experience has its own moving motif. Animations operate inside the SVG
 // continuously while the stage is open, rather than only animating modal entrance.
 const motion={
 window:'<g class="scene-flying-leaves" fill="#a9b69a"><ellipse cx="68" cy="90" rx="10" ry="5"/><ellipse cx="116" cy="50" rx="7" ry="4"/><ellipse cx="370" cy="145" rx="8" ry="5"/></g>',
 hands:'<g class="scene-hand-glow" fill="none" stroke="#edc59e" stroke-width="5"><circle cx="220" cy="209" r="62"/><circle cx="220" cy="209" r="97"/></g>',
 sound:'<g class="scene-sound-waves" fill="none" stroke="#f4dfb7" stroke-width="4"><path d="M267 130Q375 200 267 276"/><path d="M285 92Q429 205 288 315"/></g>',
 cup:'<g class="scene-steam" fill="none" stroke="#fffaf0" stroke-width="7" stroke-linecap="round"><path d="M174 143Q153 117 170 95T170 44"/><path d="M219 132Q197 101 219 77T219 23"/><path d="M264 143Q243 118 262 89T262 39"/></g>',
 chair:'<g class="scene-chair-light" fill="#fff1bd" opacity=".7"><ellipse cx="349" cy="112" rx="42" ry="44"/><path d="M330 143L266 281L407 270Z"/></g>',
 hills:'<g class="scene-clouds" fill="#fff9f0" opacity=".65"><ellipse cx="124" cy="93" rx="92" ry="18"/><ellipse cx="325" cy="70" rx="75" ry="12"/></g>',
 sunlight:'<g class="scene-sunrays" stroke="#fff4cd" stroke-width="13" opacity=".68"><path d="M80 85L365 288"/><path d="M80 129L306 310"/></g>',
 eyes:'<g class="scene-breath-mist" fill="#fff3dc" opacity=".57"><ellipse cx="215" cy="111" rx="70" ry="16"/><ellipse cx="216" cy="282" rx="60" ry="12"/></g>',
 stretch:'<g class="scene-stretch-particles" fill="#b1c8b5"><circle cx="91" cy="120" r="13"/><circle cx="342" cy="141" r="10"/><circle cx="319" cy="67" r="7"/></g>',
 phone:'<g class="scene-phone-off" fill="#f0d5a9" opacity=".86"><circle cx="334" cy="101" r="12"/><circle cx="366" cy="147" r="8"/><circle cx="352" cy="229" r="9"/></g>',
 flower:'<g class="scene-petals" fill="#f5d7c8"><ellipse cx="129" cy="70" rx="12" ry="6"/><ellipse cx="342" cy="137" rx="9" ry="5"/><ellipse cx="108" cy="248" rx="8" ry="4"/></g>',
 desk:'<g class="scene-paper-shimmer" fill="#f5e8d9" opacity=".9"><rect x="178" y="168" width="84" height="13" rx="3"/><rect x="192" y="190" width="106" height="10" rx="3"/></g>',
 leaf:'<g class="scene-leaf-fall" fill="#b6bf98"><ellipse cx="105" cy="90" rx="13" ry="8" transform="rotate(-32 105 90)"/><ellipse cx="350" cy="70" rx="11" ry="7" transform="rotate(27 350 70)"/></g>',
 paper:'<g class="scene-notes" stroke="#d5bca7" stroke-width="3" fill="none"><path d="M109 281Q175 344 292 309"/><path d="M320 92Q380 107 367 174"/></g>',
 night:'<g class="scene-shooting-star"><path d="M70 98L206 152" stroke="#fff0c0" stroke-width="5" stroke-linecap="round"/><circle cx="206" cy="152" r="5" fill="#fff8db"/></g>'
 };
 function pick(title){const found=states.find(([fragment])=>title.includes(fragment));return found||states[0]}
 function init(){
   const modal=document.getElementById('restStage');if(!modal)return;
   const art=modal.querySelector('.rest-stage-art');
   const heading=modal.querySelector('.rest-stage-heading');
   const line=modal.querySelector('.rest-stage-text');
   const detail=modal.querySelector('.rest-stage-note');
   const close=()=>{modal.hidden=true;document.body.classList.remove('rest-theatre-open')};
   function open(item){
     if(!item)return; const [,,name]=pick(item.title),type=pick(item.title)[1];
     heading.textContent=item.title;
     line.textContent=item.text;
     detail.textContent=item.note||'不用照著任何速度完成。';
     art.dataset.type=type;
     art.innerHTML='<svg viewBox="0 0 440 380" aria-hidden="true" focusable="false">'+drawing[type]+(motion[type]||'')+'</svg>';
     modal.hidden=false;
     document.body.classList.add('rest-theatre-open');
     modal.querySelector('.rest-stage-close').focus();
     window.dispatchEvent(new CustomEvent('pause:companion-close'));
   }
   modal.querySelector('.rest-stage-close').addEventListener('click',close);
   modal.querySelector('.rest-stage-finish').addEventListener('click',close);
   modal.addEventListener('click',event=>{if(event.target===modal)close()});
   document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)close()});
   window.PauseRestStage={open,close};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
})();