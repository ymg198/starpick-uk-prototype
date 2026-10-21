# StarPick（星选购）英国站：交互原型

星辰创选 case 的网页原型。目标市场是英国，核心是帮用户在低价跨境平台上**买得对、到得及时、退得起**。

全品类商城：服饰、食品饮料、家居、厨房、数码电器、美妆、运动户外、出行，共 410 个商品。界面为英文，设计风格参考 Apple App Store。所有商品、品牌、店铺、价格、评价和图片均为自编示例，**不使用任何真实品牌**。

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
| 推荐页（主页） | `#/` | **Today's Picks（今日精选）** 轮播，最多 5 页：本周销量前 3 + 评分最高 2 件，可自动播放、左右切换、手机滑动；8 个品类入口；**Guess You Like（猜你喜欢）**：登录后按历史订单推荐相关商品，新客户推荐高性价比高评分商品与大牌商品交替；Big Brands 大牌官方店；场景合集；UK 仓 2–4 天达；£10 以下 |
| 登录 / 个人中心 | 右上角头像 · `#/account` | 未登录点头像弹出登录（Apple / Google / 邮箱，原型中都登录到演示账号 Emma）；登录后点头像进入个人中心：资料、订单（再次购买、写评价）、积分优惠券、地址支付、退出登录 |
| 关键词搜索 | `#/search?q=…` | **每个关键词至少 10 个结果**（不足时补充同品类相关商品，完全无匹配时显示热门商品）；顶栏搜索联想（含高亮）、最近搜索、热搜榜；倒排索引 + 英美同义词（comforter→duvet）+ 前缀匹配 + 1 个字母的拼写纠错（ketle→kettle）；分类、UK 仓、排序筛选 |
| 商品详情 | `#/product/:id` | 价格与折扣、颜色、尺码；Buy now 下单（需登录，订单会进入个人中心并影响“猜你喜欢”）；**Before you buy 关键事实卡**，按品类显示不同信息：服饰显示版型偏大/偏小，食品显示过敏原和保质期，美妆显示适用肤质，电器显示插头和 UKCA/CE，大牌显示官方店保障；**配送日期检查**（输入“需要日期”，判断能否按时到达，并推荐更快的替代品）；**Will it fit? 尺寸核对**（cm/in 切换）；规格表 |
| 商家图 | 详情页顶部图集 | 每个商品 5 张：主图（卖点标题 + 到手价条）、卖点图、尺码/规格/成分图、场景图、颜色款式图或包装清单图；可左右滑动、点缩略图切换、点击放大 |
| 评价展示 / 买家秀 | 详情页下半部分 | 评分分布、三项口碑指标、**Customer photos 买家秀**一栏（可点开大图浏览），带图评价附 1–3 张买家照片；筛选（有图、5 星、差评、按标签） |
| 竞品 PK | `#/compare?ids=a,b,c` | 最多 3 件商品对比，逐行高亮胜出项；顶部给出“最便宜 / 评分最高 / 最快到 / 最少意外”结论；详情页可一键 PK 同类商品，底部浮动 PK 栏 |

## 目录结构

```
index.html          页面骨架（顶栏、主视图、PK 浮动栏）
css/style.css       全部样式；颜色变量在 :root，含深色模式
data/products.js    41 个基础商品、分类、手写评价、热搜词、演示账号 ← 改数据主要改这里
data/variants.js    每个商品对应的插画类型 + 生成同款其他店铺商品（每个基础商品 9 个，共 410 个）
js/art.js           41 种商品矢量插画（按颜色变化）
js/images.js        商家图（5 张模板）和买家秀照片生成；优先使用 img/manifest.js 登记的实拍图
img/manifest.js     实拍图 / AI 生成图登记清单（目前为空）
docs/chatgpt-photo-prompt.md  让 ChatGPT 生成商品图与买家秀的提示词
js/auth.js          登录状态、下单、购买记录
js/app.js           路由、搜索联想、PK 栏、购物袋计数
js/search.js        关键词索引（同义词、纠错、联想）
js/reviews.js       评价生成与星级分布
js/utils.js         通用函数：价格、日期、星星、商品图标、商品卡片
js/views/home.js    推荐页
js/views/search.js  搜索与分类结果页
js/views/product.js 商品详情 + 评价
js/views/compare.js 竞品 PK
js/views/account.js 个人中心
```

## 常见修改

- **加商品**：在 `data/products.js` 的 `PRODUCTS` 里复制一个 `make({...})`，改一个新的 `id`。`category` 必须是 `CATEGORIES` 里的 id；`warehouse: 'UK' | 'CN'` 决定配送时效；`brand` + `official: true` 表示大牌官方店；`weekSold` 是本周销量，决定能否进入今日精选。
- **改演示账号或历史订单**：修改 `DEMO_USER.orders`，“猜你喜欢”会随之变化。
- **品牌说明**：所有品牌（Kestrun、Norhaven、Sonaro、Aurevia、Velora、Pulsewave 等）和店铺名都是虚构的，图片中也没有任何真实 logo。新增商品时请继续使用虚构品牌，避免侵权。
- **接入实拍图 / AI 生成图**：把图片放进 `img/products/<商品ID>/`（5 张商品图）和 `img/reviews/<商品ID>/`（买家秀），再在 `img/manifest.js` 里登记路径即可，无需改代码；同款商品自动共用基础商品的图片，未登记的商品继续显示插画。可直接使用 `docs/chatgpt-photo-prompt.md` 里的提示词让 ChatGPT 生成并接入。
- **调整同款商品数量**：`data/products.js` 末尾的 `generateVariants(BASE_PRODUCTS)` 可以传第二个参数，例如 `generateVariants(BASE_PRODUCTS, 5)`。
- **加手写评价**：在 `CUSTOM_REVIEWS` 里按商品 id 添加。
- **改主页的推荐逻辑或合集**：修改 `js/views/home.js` 里的 `todaysPicks()`（今日精选）、`guessYouLike()`（猜你喜欢）和 `COLLECTIONS`。
- **改主题色**：修改 `css/style.css` 顶部的 `--blue` 等变量。

## 演示脚本（约 3 分钟）

1. 首页 **Today's Picks**：轮播展示本周销量冠军（耳机、T 恤、咖啡豆）和评分最高的商品（精华、巧克力）。
2. 未登录时，“Guess You Like”是给新客户的高性价比 + 大牌交替推荐。点右上角头像 → Continue with Apple 登录。
3. 登录后，“Guess You Like”变成按历史订单推荐（跑鞋 → 运动商品，咖啡豆 → 其他饮品），每张卡片标注 “You bought …”。
4. 打开 **Norhaven Packable Down Jacket**：左右滑动 5 张商家图，点开看大图；关键事实卡提示“偏小，建议大一码”；不选尺码点 Buy now 会提示先选尺码。往下看 Customer photos 买家秀。
5. 点 “PK it” 和其他冬装对比（或从 PK 页加到 3 件）：价格、版型、配送、退货逐行高亮胜出项。
6. 打开 **Arc Minimal Desk Lamp**：提示欧标插头、只有 CE 标志；“I need it by”提示可能晚到，并推荐英国仓的替代品。
7. 搜索 `serum`、`coffee`、`yoga mat` → 每个都有 10 个以上结果；搜索 `sneakers`（美式说法）→ 找到 trainers；搜索 `ketle`（拼错）→ 自动纠正为 kettle。
8. 点头像进入个人中心，查看订单、再次购买、退出登录。

## 协作方式

```bash
git clone <仓库地址> && cd <仓库目录>
git checkout -b feature/你的功能名
# 修改后
git add . && git commit -m "说明改了什么"
git push -u origin feature/你的功能名
# 然后在 GitHub 上发 Pull Request
```
