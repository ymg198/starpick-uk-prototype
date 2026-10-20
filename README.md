# StarPick（星选购）英国站：交互原型

星辰创选 case 的网页原型。场景是英国市场的家居与生活用品：帮用户在低价跨境平台上**买得对、到得及时、退得起**。

界面为英文，设计风格参考 Apple App Store。所有商品、价格和评价均为自编示例数据。

## 本地运行

项目是纯静态网页，没有构建步骤，但使用了 ES Modules，所以需要用本地服务器打开，不能直接双击 `index.html`：

```bash
# 任选一种
python3 -m http.server 8000
npx serve .
```

然后打开 http://localhost:8000 。VS Code 用户也可以安装 Live Server 插件，右键 `index.html` → Open with Live Server。

## 功能与页面

| 页面 | 路由 | 内容 |
| --- | --- | --- |
| 推荐页（主页） | `#/` | Today 头图、分类入口、“为你推荐”（根据浏览记录变化）、场景合集、UK 仓 2–4 天达、£10 以下、编辑精选 |
| 关键词搜索 | `#/search?q=…` | 顶栏搜索联想（含高亮）、最近搜索、热搜榜；倒排索引 + 英美同义词（comforter→duvet）+ 前缀匹配 + 1 个字母的拼写纠错（ketle→kettle）；分类、UK 仓、排序筛选 |
| 商品详情 | `#/product/:id` | 价格与折扣、颜色；**Before you buy 关键事实卡**（插头、电压、UKCA/CE、尺码提示、退货）；**配送日期检查**（输入“需要日期”，判断能否按时到达，并推荐更快的替代品）；**Will it fit? 尺寸核对**（cm/in 切换）；规格表 |
| 评价展示 | 详情页下半部分 | 评分分布、三项口碑指标（尺寸准确 / 与图片一致 / 质量）、筛选（有图、5 星、差评、按标签） |
| 竞品 PK | `#/compare?ids=a,b,c` | 最多 3 件商品对比，逐行高亮胜出项；顶部给出“最便宜 / 评分最高 / 最快到 / 最少意外”结论；详情页可一键 PK 同类商品，底部浮动 PK 栏 |

## 目录结构

```
index.html          页面骨架（顶栏、主视图、PK 浮动栏）
css/style.css       全部样式；颜色变量在 :root，含深色模式
data/products.js    商品、分类、手写评价、热搜词 ← 改数据只需改这里
js/app.js           路由、搜索联想、PK 栏、购物袋计数
js/search.js        关键词索引（同义词、纠错、联想）
js/reviews.js       评价生成与星级分布
js/utils.js         通用函数：价格、日期、星星、商品图标、商品卡片
js/views/home.js    推荐页
js/views/search.js  搜索与分类结果页
js/views/product.js 商品详情 + 评价
js/views/compare.js 竞品 PK
```

## 常见修改

- **加商品**：在 `data/products.js` 的 `PRODUCTS` 里复制一个对象，改一个新的 `id`（例如 `l5`）。`warehouse: 'UK' | 'CN'` 决定配送时效，`plug` 决定关键事实卡的提示。
- **加手写评价**：在 `CUSTOM_REVIEWS` 里按商品 id 添加。
- **改主页的推荐逻辑或合集**：修改 `js/views/home.js` 里的 `recommended()` 和 `COLLECTIONS`。
- **改主题色**：修改 `css/style.css` 顶部的 `--blue` 等变量。

## 演示脚本（约 3 分钟）

1. 首页 → 点开 **Arc Minimal Desk Lamp**：关键事实卡提示它是欧标插头且只有 CE 标志。
2. 点 “PK it” 和 Lumi 台灯对比 → 插头、配送、退货三行都是 Lumi 胜出。
3. 搜索 `under bed` → 打开 **Slim Under-Bed Box**，在 “Will it fit?” 的 H 一栏输入 16 → 显示放不下；评价里也有用户反映 “Size mismatch”。
4. “I need it by” 选一周后 → 提示可能晚到，并推荐 UK 仓发货的替代品。
5. 搜索 `ketle`（故意拼错）→ 自动纠正为 kettle。

## 协作方式

```bash
git clone <仓库地址> && cd <仓库目录>
git checkout -b feature/你的功能名
# 修改后
git add . && git commit -m "说明改了什么"
git push -u origin feature/你的功能名
# 然后在 GitHub 上发 Pull Request
```
