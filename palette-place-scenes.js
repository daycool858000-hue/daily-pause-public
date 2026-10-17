// 今日一息｜八張獨立生成的淡彩景觀。2026-10-17 起完全停止舊 SVG 產圖與舊縮圖。
// Background source and thumbnail always refer to the same independently generated WebP.
(function(){
  'use strict';
  const items=Object.freeze([
    ['forest','森林','霧林、綠蔭與安靜的湖畔'],
    ['ocean','海洋','粉彩天空與緩慢的海潮'],
    ['room','房間','柔和窗光與留白的臥室'],
    ['living','客廳','暖光、植物與舒適的沙發'],
    ['cafe','咖啡廳','湖畔窗景與溫柔室內光影'],
    ['park','公園','湖邊長椅與柔軟樹影'],
    ['street','街道','雨後街燈與朦朧倒影'],
    ['mountain','山水湖景','層層遠山與輕霧湖水']
  ]);
  const ids=new Set(items.map(([id])=>id));
  const imageUrl=id=>ids.has(id)?'./media/palette-scenes/'+id+'.webp':'';
  window.PausePlaceScenes=Object.freeze({
    items, imageUrl, thumbnailUrl:imageUrl
  });
})();
