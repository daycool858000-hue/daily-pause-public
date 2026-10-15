# 情緒調色盤 2.0｜景觀試作素材來源與品質狀態
查核日期：2026-10-15　狀態：**開發分支試作，未核准公開部署**

## 來源與製程
本批 8 張 `palette-*-v1.webp` 為本次 ChatGPT 影像生成的**概念拼圖中裁切出的單張場景**，而非各自原生生成的 960 × 630 高畫質照片。原始生成影像檔名為 `a_wide_clean_grid_like_a_pre.png`，SHA-256：

`19e11f4778eef62b7644e1903895c2919224aa1a686a886b075ed0e9d69f5540`

製程：裁掉概念拼圖的中文場景標籤與版面邊界，將每張獨立風景擴大至 960 × 630 像素、適度銳化後編碼為 WebP。原始概念拼圖**未**放進公開網站或直接作為畫布背景；僅有完成裁切的無文字、無 UI 圖片置於本開發分支。因源圖面板尺寸有限，細節仍偏軟，必須以真正的獨立高品質場景重新產製後才可認定完成。

本批來自 ChatGPT 當次生成結果，未自行抓取網路照片；仍需保留工具紀錄與最終素材使用權利審核。**「來源可追溯」不等於法律上保證完全無爭議。**

## 素材清單

| 開發素材 | 場景選單名稱 | SHA-256 |
| --- | --- | --- |
| `palette-morning-bedroom-v1.webp` | 晨光房間 | `621489c9fba0ec79f024c12bb6c8aa474bbcca569bdb406ce4f717fe7229a98f` |
| `palette-warm-living-room-v1.webp` | 溫暖客廳 | `9ac7c9abb8d5fad6d67be32372f44a2e2cc7d77139a0be12eb0839076c57fb86` |
| `palette-rain-window-v1.webp` | 窗邊雨天 | `c6ae6dca377da4dece4255d4fa3962601cf7fd9b8fac36c4cb189c34fa22c02d` |
| `palette-quiet-study-v1.webp` | 安靜書房 | `f046b15df52a421ffdd9acc2c2d0175c2b8acc709f2eb3c21698be14c8b377ae` |
| `palette-island-v1.webp` | 慢慢的小島 | `986d3c76b8453ee975231895efa8af306c47bb61e44cb0f24c2fdae74c2b781a` |
| `palette-balcony-v1.webp` | 黃昏陽台 | `a8f5927739305cd89b8067b82a94fae8af5f8853e486c9a25934dd684bc2c415` |
| `palette-cloud-v1.webp` | 雲上 | `0b567e8e9c09d1487069c01a200a3235c5e5ce12cd9b630138953d9d0f9a1b90` |
| `palette-sunrise-v1.webp` | 初醒時 | `3b671643578ff251440f1bc98413922533c822a63fd0d6191bbd8bc5986ba03b` |

## 尚未完成的關卡
1. 每張場景的真正獨立高畫質生成、美術一致性、前／中／遠景、手機顯示銳利度。
2. 全部 24 種情緒的預設構圖、各種情緒特效與切換背景後的舒適度最終視覺審查。
3. iPhone 實機觸控、PNG/JSON 往返與效能驗收。
4. 原有 12 張生成圖的來源與權利紀錄，不因這批圖片新增而視為已完成查核。
5. 使用者對本批試作圖片的視覺核准。

本次未動正式 `main`，未部署 GitHub Pages，未更動既有寄放所資料或陪伴花園功能。