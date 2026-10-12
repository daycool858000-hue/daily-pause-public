# 每日一息｜獨立 ZIP 備份還原與測試作業手冊（2026-10-12）

## 本次建立了哪些可重複執行的測試

公開庫新增：
- `scripts/site-audit.mjs`：驗證 HTML 引用、9支JS語法、27/25/36篇內容、108個長文小節、97個現用來源、117筆引用、80張小卡、31則每日提醒、15組互動、45個閱讀入口與對應內文、15張圖片檔案和檔案格式。
- `scripts/locker-audit.mjs`：用**虛構測試文字**模擬寄物所：空櫃、存入、鎖定、提前讀取被拒、重啟保存、到期取回、HTML注入字元跳脫、取回清空、儲存空間拒絕寫入警告。不是讀取任何訪客的真實寄放文字。
- `scripts/verify_restore.py`：在GitHub全新 runner 中**重新從GitHub的指定提交下載ZIP**，解壓到和checkout不同的乾淨暫存資料夾，逐檔SHA-256比對（程式、素材、權利報告、測試腳本全部包含）、在還原資料夾執行上列Node測試、啟動本機HTTP伺服器並請求首頁、CSS、JS及全部圖片，確認HTTP 200及非空內容。
- `.github/workflows/verify-restore.yml`：每次main推送及手動執行均會跑上述檢驗；失敗必須顯示失敗，不得視為驗收通過；成功時保留GitHub Actions log與 `restore-evidence` artifact（30天）。

### 官方測試入口

https://github.com/daycool858000-hue/daily-pause-public/actions/workflows/verify-restore.yml

請選最新的main SHA，確認該工作流程的結果為success；**GitHub Pages deploy成功與本還原測試是兩個獨立結果**。

## 如何自行離線保存完整公開站

1. 前往 https://github.com/daycool858000-hue/daily-pause-public 。
2. 選 **Code → Download ZIP**。如要固定版本，使用指定commit的 **Browse files** 後下載該SHA的ZIP。
3. 於獨立資料夾解壓縮，確認 `index.html`、`styles.css`、所有 `.js`、`media/`、`media/generated/`、`scripts/` 都存在。
4. 有Node.js的電腦執行 `node scripts/site-audit.mjs .` 與 `node scripts/locker-audit.mjs .`，不需要安裝第三方套件。
5. 在解壓目錄執行 `python3 -m http.server 8000`，瀏覽 http://localhost:8000 ，依照抽卡、閱讀、抽屜、調色盤、寄物所逐項操作。這裡是說明手動流程，不能把它冒充已由使用者親自執行的另一台電腦演練。

GitHub版本記錄和ZIP是**公開程式／素材備份**，不是訪客的 `localStorage` 備份，也不是Manus編輯器的源專案或第三方素材的授權憑證。

## 已知安全、測試與備份邊界

- 使用者已回報在手機及電腦打開和操作過：抽卡、動畫、文章閱讀、好奇心抽屜、來源更動、風險說明、調色盤。這是**使用者實測回報**，不可寫成由AI遠端親自操控手機。
- 寄物所尚未由使用者用真實手機進行「存入文字→到期取回」操作；新增的Node模擬只驗證指定互動程式路徑，不證明每一個瀏覽器介面與時間跳轉均完全相同。
- 12張AI圖生成紀錄未由原平台提供；3張Commons圖片的來源圖與本地二進位對照非此還原測試的範圍。**SHA-256比對只能證明備份與當前庫相同，不能證明它們符合第三方授權。**
- 若儲存庫、主分支或GitHub帳號被誤刪，獨立離線ZIP可補救程式，但無法補救未納入備份的私密資料。建議依重要程度持續保存不同日期的ZIP備份。

## 最後一輪CI獨立還原實際結果（基準3893d8f6）

- GitHub Actions 2026-10-12 [Independent archive restore and content QA #38198386896](https://github.com/daycool858000-hue/daily-pause-public/actions/runs/38198386896) **success**。
- 同SHA GitHub Pages [部署 #38198386302](https://github.com/daycool858000-hue/daily-pause-public/actions/runs/38198386302) **success**。
- GitHub runner下載GitHub提交ZIP後於乾淨環境解壓，以**49個檔案逐檔SHA-256比對成功**，含**15個圖片**；以本機HTTP伺服器驗證**26次資源請求**成功。
- Node檢測 80張卡、31則每日提醒、15組互動、45個閱讀入口、27長文／25短文／36抽屜、117處引用／97個現用網址，**通過**。
- 寄物所虛構文字模擬：存入、鎖定、不提前揭露、重新載入、到期取回、轉義HTML及儲存失敗警告，**通過**。
- 此項是對**指定基準提交**的完整ZIP復原測試，後續追加的曼荼羅詞條與報告修正須以當次最新版Actions再次核實。
- GitHub ZIP比對不是第三方圖片來源版權確認；不含原始Manus編輯器內部資料，也不會備份個別訪客的localStorage。


## 閱讀來源連結增補後的驗證

- 16筆外部閱讀入口應在閱讀彈窗顯示可點擊的安全來源連結；4個原創入口及25篇附加原創短文不連到假的外部來源。
- `scripts/site-audit.mjs`新增簡化DOM模擬，核對曼荼羅來源實際渲染成超連結與原創不建立假連結，並檢查關鍵機構名稱／網址、正念索引名稱。
- 最新提交的ZIP獨立還原與GitHub Pages部署須分別success，不能直接借用3893d8f6或cbec0174測試結果。ZIP不含訪客localStorage及Manus私有編輯工程。
