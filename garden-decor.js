// 今日一息｜陪伴花園可擺放的原創場景小物。全部為純 SVG，無外部素材。
(() => {
'use strict';
const defs={
  bench:['木長椅',`<ellipse cx="79" cy="126" rx="68" ry="7" fill="#304a38" opacity=".13"/><path d="M28 72h104M32 89h96M40 100h80" stroke="#a27c56" stroke-width="12" stroke-linecap="round"/><path d="M38 100l-9 32m96-32 11 32M32 93v-45m94 45v-45" stroke="#80654f" stroke-width="8"/><path d="M29 51h104" stroke="#ae8d69" stroke-width="12" stroke-linecap="round"/>`],
  pot:['陶盆',`<ellipse cx="80" cy="128" rx="46" ry="7" fill="#354f37" opacity=".1"/><path d="M43 76h75l-11 49H55Z" fill="#bc906f" stroke="#986e54" stroke-width="3"/><ellipse cx="81" cy="77" rx="41" ry="9" fill="#d4b08a"/><path d="M80 76V24M78 56Q48 20 36 35Q47 61 78 56M84 42Q115 6 132 19Q128 49 84 42" stroke="#689178" stroke-width="5" fill="#8db69a"/><ellipse cx="76" cy="21" rx="10" ry="14" fill="#b6c99a"/>`],
  lantern:['小燈',`<ellipse cx="83" cy="126" rx="38" ry="6" fill="#625644" opacity=".2"/><path d="M82 116V56M80 59q-21-27 2-36q25 12 0 36" fill="none" stroke="#8b785e" stroke-width="7"/><path d="M55 63h55l-7 49H62Z" fill="#ffe3a0" stroke="#89785e" stroke-width="5"/><path d="M55 63l27-27 28 27M62 112h41M74 68v42m16-42v42" fill="none" stroke="#806b52" stroke-width="5"/><circle cx="82" cy="87" r="22" fill="#ffebc1" opacity=".6"/>`],
  birdbath:['鳥浴盆',`<ellipse cx="79" cy="128" rx="50" ry="7" fill="#47524a" opacity=".14"/><path d="M80 121V69" stroke="#a9a9a0" stroke-width="12"/><path d="M63 124h34M33 63Q80 97 129 63Z" fill="#b1b9ae" stroke="#7d968d" stroke-width="4"/><path d="M42 63q38-13 78 0" stroke="#cfe2db" stroke-width="7" fill="none"/><path d="M61 49q16-18 31 2q-14 17-31-2" fill="#d3ac82"/><circle cx="89" cy="44" r="3" fill="#514841"/>`],
  scarecrow:['稻草人',`<path d="M78 132V12M35 42h87" stroke="#8b7052" stroke-width="7"/><path d="M61 43q19-19 38 0l18 58H43Z" fill="#a6aa85" stroke="#8d9270" stroke-width="4"/><path d="M48 25h65M65 25V9h31v16" fill="#b99d72" stroke="#968264" stroke-width="4"/><circle cx="81" cy="37" r="17" fill="#edd9b1"/><circle cx="75" cy="35" r="2" fill="#776954"/><circle cx="89" cy="35" r="2" fill="#776954"/><path d="M76 43q7 6 13 0" fill="none" stroke="#977e67" stroke-width="2"/>`],
  fence:['木圍籬',`<path d="M12 30v98M52 30v98M92 30v98M132 30v98" stroke="#aa906e" stroke-width="13" stroke-linecap="round"/><path d="M9 62h137M9 104h137" stroke="#c1a786" stroke-width="12" stroke-linecap="round"/>`],
  barrel:['木桶',`<ellipse cx="82" cy="127" rx="51" ry="7" fill="#374936" opacity=".15"/><path d="M39 43q-2 45 5 76q38 20 77-1q8-51 4-75Z" fill="#ac835e" stroke="#795c46" stroke-width="4"/><path d="M42 69q40 11 81 0M44 107q40 12 78 0" stroke="#7a817b" stroke-width="10" fill="none"/><ellipse cx="82" cy="44" rx="45" ry="13" fill="#8b674c" stroke="#b59269" stroke-width="6"/>`],
  wateringcan:['澆水壺',`<path d="M43 56h72l-8 61H50Z" fill="#8eaaa5" stroke="#628781" stroke-width="4"/><path d="M43 65Q15 39 14 75q1 22 30 12M113 63l39-34M136 24q12 1 20 13" fill="none" stroke="#789b92" stroke-width="9"/><rect x="62" y="31" width="40" height="10" rx="5" fill="#789c91"/><path d="M66 35v19m30-19v19" stroke="#789c91" stroke-width="6"/>`],
  log:['倒木',`<ellipse cx="80" cy="113" rx="72" ry="21" fill="#374e39" opacity=".14"/><path d="M13 76l102-24q28 15 24 45L42 123Q5 113 13 76Z" fill="#93755b" stroke="#6e5747" stroke-width="4"/><ellipse cx="118" cy="79" rx="24" ry="30" fill="#b49472" stroke="#735b47" stroke-width="5"/><ellipse cx="118" cy="79" rx="14" ry="18" fill="none" stroke="#8b7054" stroke-width="3"/><path d="M36 79l64-14M41 106l53-17" fill="none" stroke="#c1a082" stroke-width="4" opacity=".6"/>`],
  stones:['溪石',`<ellipse cx="81" cy="126" rx="72" ry="7" fill="#304e40" opacity=".13"/><path d="M15 118q-5-34 32-42q31 4 36 42Z" fill="#929e97"/><path d="M70 121q0-49 37-55q30 6 40 55Z" fill="#b6c0b3"/><path d="M30 98q19-24 39-1m25-10q20-11 32 0" stroke="#e4e7da" stroke-width="4" fill="none" opacity=".35"/>`],
  mushroom:['蘑菇',`<ellipse cx="80" cy="126" rx="64" ry="9" fill="#58785d" opacity=".16"/><path d="M55 68h40l-5 56H62Z" fill="#f1d9bd"/><path d="M40 75q-2-58 40-58q43-1 45 58Z" fill="#b48073"/><circle cx="62" cy="47" r="8" fill="#f4dfc9"/><circle cx="96" cy="37" r="10" fill="#f4dfc9"/><path d="M108 110h22v13h-20Z" fill="#efd7b9"/><path d="M97 113q0-29 23-30q19 0 24 30Z" fill="#ca9e88"/>`],
  sign:['小木牌',`<ellipse cx="84" cy="126" rx="53" ry="8" fill="#40523d" opacity=".16"/><path d="M79 126V23" stroke="#8c6e55" stroke-width="9"/><path d="M22 26h116l-9 56H31Z" fill="#bda080" stroke="#886b50" stroke-width="5"/><path d="M47 53h67M55 66h54" stroke="#8c7157" stroke-width="4" opacity=".6"/>`],
  umbrella:['遮陽傘',`<ellipse cx="86" cy="129" rx="64" ry="8" fill="#4a604f" opacity=".13"/><path d="M79 127V39" stroke="#9b8b74" stroke-width="8"/><path d="M17 55Q19 5 80 7Q141 6 151 55Z" fill="#e1c79f" stroke="#aa997d" stroke-width="4"/><path d="M80 7V55M35 39q45-27 93 0" stroke="#f7e9cd" stroke-width="5" opacity=".55"/><path d="M79 127l-30 3m30-3 30 3" stroke="#9b8b74" stroke-width="6"/>`],
  shell:['貝殼',`<ellipse cx="81" cy="119" rx="62" ry="9" fill="#4f5543" opacity=".15"/><path d="M35 110Q8 25 83 25Q154 25 125 110Q82 139 35 110Z" fill="#e8cbb2" stroke="#c4a38d" stroke-width="5"/><path d="M83 28v91M58 35l17 85M109 35l-18 85M39 62l40 58M127 62l-41 58" fill="none" stroke="#bf9c88" stroke-width="3"/>`],
  driftwood:['漂流木',`<path d="M14 107q48-34 99-36q29-16 38-43M113 73l-6-37M74 87L43 40" fill="none" stroke="#ae9475" stroke-width="15" stroke-linecap="round"/><path d="M16 105q43-26 95-32" fill="none" stroke="#e1c7a0" stroke-width="3" opacity=".6"/>`],
  mat:['野餐墊',`<path d="M17 98 101 52l44 51-84 33Z" fill="#a3b7a4" stroke="#7f9984" stroke-width="4"/><path d="M38 85l46 50M57 76l46 50M77 65l46 50M23 106l84-43M42 123l86-42" stroke="#e9e5cb" stroke-width="5" opacity=".67"/>`],
  birdhouse:['鳥屋',`<path d="M78 132V55" stroke="#92735d" stroke-width="9"/><path d="M39 57 79 16l43 41v52H39Z" fill="#bd9a76" stroke="#8c6d52" stroke-width="5"/><path d="M30 57l49-47 49 47" fill="none" stroke="#80634b" stroke-width="10"/><circle cx="79" cy="73" r="16" fill="#705a46"/><path d="M72 97h17" stroke="#e4c69c" stroke-width="7"/>`]
};
const worlds={
 flowers:['bench','pot','lantern','birdbath'],
 farm:['scarecrow','fence','barrel','wateringcan'],
 forest:['log','stones','mushroom','sign'],
 coast:['umbrella','shell','driftwood','bench'],
 park:['bench','mat','lantern','birdhouse']
};
function markup(item){
 const found=defs[item.type];if(!found)return '';
 return '<svg class="garden-decoration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" aria-hidden="true">'+found[1]+'</svg>';
}
window.PauseGardenDecor={worlds,defs,markup};
})();