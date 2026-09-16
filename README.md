# OII Lab 演算法互動遊戲集

用「遊戲」把演算法講清楚 —— 每個遊戲都搭配同一套演算法的即時視覺化與圖文解析，讓抽象的演算法概念變得可操作、可觀察。

🔗 **線上遊玩：** https://oii-lab.github.io/oii-lab-games/index.html
📚 **OII Lab 教學網站：** https://oii-lab.github.io/oii-lab/#home

---

## 這是什麼

OII Lab 是一個獨立的演算法教育品牌，透過遊戲、短影音與圖文教學教授 C++ 與組合賽局理論（combinatorial game theory）。本專案是其中的**互動遊戲平台**：純前端網站，玩家可以單機對電腦、同機雙人，或連線多人對戰，同時觀察演算法在背後如何運作。

每個遊戲都有兩個頁面：
- **遊戲本體**（`games/xxx.html`）：可操作的遊戲介面
- **演算法解析**（`games/xxx-algo.html`）：對應演算法的原理說明、複雜度分析與程式碼

## 收錄內容

| 分類 | 遊戲 | 演算法 |
|---|---|---|
| 博弈理論 | Bachet's Game | DP → O(1) 模運算 |
| | 21 點報數 | DP → O(1) 模運算 |
| | Nim 多堆 | Nim-sum（XOR） |
| | Wythoff's Game | ⌊n·φ⌋ 公式 |
| | Chomp | Minimax + 記憶化 |
| | Connect Four | Alpha-Beta 剪枝 |
| | Turning Turtles | Sprague-Grundy 定理 |
| 動態規劃 | DP 入門 | 遞迴 vs 填表（Fibonacci） |
| | Coin Row | 區間 DP |
| | 背包問題 | 0/1 Knapsack |
| | 區間排程 | Greedy + DP |
| 圖論與搜尋 | BFS / DFS | 圖搜尋視覺化 |
| | Dijkstra | 最短路徑，O((V+E) log V) |
| | BST 操作 | 二元搜尋樹插入／刪除 |
| 搜尋 | Binary Search | O(log n) vs O(n) 比較 |
| 排序與貪心 | 視覺化排序 | Bubble / Quick / Merge，O(n²) vs O(n log n) |

另有 `algo.html` 作為所有演算法解析頁的索引。

## 技術架構

- **前端**：純 HTML / CSS / JavaScript，無框架、無建置流程
- **多人連線**：Firebase 提供即時對戰的房間狀態同步
- **靜態託管**：GitHub Pages
- **共用資源**（`shared/`）：
  - `style.css` — 全站共用樣式與設計變數，含亮／暗主題
  - `ui.js` — 面板切換、房號產生、對戰紀錄、慶祝動畫等共用工具函式
  - `theme.js` — 亮／暗主題切換（存於 localStorage，右上角浮動按鈕）
  - `firebase.js` — 多人連線邏輯
- **演算法驗證**：以 Node.js 對各遊戲的核心演算法（DP 轉移式、BST 操作等）另行測試，確保教學內容正確無誤

## 專案結構

```
oii-lab-games/
├── index.html              # 遊戲總覽首頁
├── algo.html                # 演算法解析索引
├── games/
│   ├── <game>.html          # 遊戲頁面
│   └── <game>-algo.html     # 對應的演算法解析頁面
├── shared/
│   ├── style.css
│   ├── ui.js
│   ├── theme.js
│   └── firebase.js
└── assets/
    └── icons/
```

## 本機開發

純靜態網站，開一個本機伺服器即可（避免部分瀏覽器對 `file://` 的限制）：

```bash
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

多人連線功能需要在 `shared/firebase.js` 設定對應的 Firebase 專案。

## 設計原則

- **視覺化優先於互動**：遊戲的重點是把演算法「畫出來」，而不是單純的可玩性（例如迷宮從「可走的迷宮」改為 BFS/DFS 的圖視覺化）
- **一進頁面就看得懂**：不需要額外操作即可理解畫面在呈現什麼（例如 BST 頁面一開啟就自動載入範例樹）
- **正確性優先**：所有教學內容在標為「正確」前都經過驗證測試

## Roadmap

- 持續擴充更多演算法主題
- 修復 `bachet.html` 中一個已知但延後處理的 Firebase 多人「再來一局」錯誤
