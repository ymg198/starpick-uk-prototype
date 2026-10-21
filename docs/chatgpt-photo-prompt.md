# 给 ChatGPT 的提示词：为 StarPick 原型生成商品实拍图与买家秀，并推送到 GitHub

> 使用方法：把下面「提示词正文」整段复制给 ChatGPT（需开启图片生成；如能连接 GitHub 或运行代码更好）。商品表和评价表已附在正文末尾，无需另外提供。

---

## 提示词正文

### 1. 你的角色与目标

你是一名电商商品摄影师兼前端工程师。请为一个英国跨境电商网页原型 **StarPick** 生成**写实风格的商品图和买家秀照片**，并把图片准确接入网站代码、推送到 GitHub 仓库。

- 仓库：https://github.com/ymg198/starpick-uk-prototype （分支 `main`）
- 网站是纯静态网页（HTML/CSS/JavaScript），无需构建。
- 网站已经预留好“实拍图接口”：**你不需要改任何 JavaScript 逻辑**，只需要：
  1. 把图片放进 `img/products/<商品ID>/` 和 `img/reviews/<商品ID>/`；
  2. 在 `img/manifest.js` 里登记这些图片的路径。
  没有登记的商品会继续显示代码绘制的插画，所以可以分批完成。

### 2. 必须遵守的规则（违反任何一条都要重做）

1. **不出现任何真实品牌**：图片中不得有真实品牌的 logo、商标、标志性图案（如知名运动品牌的勾、三道杠等）、可识别的包装设计。
2. **图片中不出现可读文字**：包装、标签上只用空白或模糊色块，不要生成英文/中文字样（价格、卖点文字由网页本身显示）。
3. **不出现可识别的真实人物**：上身/手持图只拍到脖子以下、手部或背影，不出现清晰人脸。
4. **严格按商品简介出图**：颜色、材质、尺寸比例、件数（如 3 件装、2 只装）、插头类型、规格必须与下文商品表一致。例如 f2 是“可收纳进自身口袋的轻薄羽绒服”，l2 是“带欧标两脚插头的金属摆臂台灯”。
5. **同一商品的 5 张图必须是同一件商品**：外形、颜色、细节一致，不能每张图像不同的东西。
6. 这些图片属于 **AI 生成的模拟图片**，必须在 README 中注明（见第 7 步）。

### 3. 图片规格与命名

| 类型 | 尺寸 | 格式 | 路径与文件名 |
|---|---|---|---|
| 商品图（每个商品 5 张） | 1200 × 1200 | JPG，单张 ≤ 300 KB | `img/products/<ID>/1.jpg` … `5.jpg` |
| 颜色主图（可选，每色 1 张） | 1200 × 1200 | JPG | `img/products/<ID>/color-<颜色小写，空格换成短横线>.jpg`，如 `color-grey-marl.jpg` |
| 买家秀公共图（每个商品 3–4 张） | 1080 × 1080 | JPG，单张 ≤ 250 KB | `img/reviews/<ID>/1.jpg` … `4.jpg` |
| 指定评价的买家秀（见评价表） | 1080 × 1080 | JPG | `img/reviews/<ID>/<评价ID>-1.jpg`，如 `img/reviews/l2/l2c0-1.jpg` |

### 4. 每个商品的 5 张商品图（顺序固定）

| 序号 | 镜头 | 要求 |
|---|---|---|
| 1 | 白底主图 | 纯白或浅灰无缝背景，商品居中占画面约 70%，柔和棚拍光，轻微落地阴影；颜色用商品表里的**第一个颜色** |
| 2 | 细节特写 | 微距拍材质与做工：面料纹理、拉链、缝线、接口、按键、成分质地等 |
| 3 | 尺寸与比例 | 与常见参照物同框（A4 纸、手、马克杯、床、登机箱尺寸架等），让人直观看出大小；有尺码的服饰可平铺展示 |
| 4 | 使用场景 | 英国家庭或日常环境中使用：服饰上身（不露脸）、食品在厨房台面摆盘、家居在卧室/客厅、电器在书桌、运动用品在家庭健身角或户外、出行用品在机场/车内 |
| 5 | 颜色或包装清单 | 多色商品：所有颜色并排摆放；单色商品：俯拍“开箱清单”（商品 + 配件 + 包装，包装上无文字） |

统一风格：真实相机拍摄质感（如 50mm 镜头、f/4、自然光或柔光箱），干净、明亮、偏暖的现代电商风，不要插画感、3D 渲染感或过度锐化。

### 5. 买家秀照片

- 风格：**普通买家用手机随手拍**，不要棚拍感。可以有轻微倾斜、自然室内光、生活背景（床单、木桌、地毯、沙发、浴室台面、车内等），画质略带噪点。
- 每个商品先做 **3–4 张公共买家秀**：不同背景、角度、光线；内容为正常的、偏正面的使用状态（拆箱、上身、使用中）。网站会自动把它们分配给该商品的带图评价。
- **评价表里列出的评价必须单独出图**，画面要准确体现评价内容（例如“收到的是欧标插头，只好另买转换头”→ 拍台灯插头插在一个白色英标转换头上）。

### 6. 生图提示词模板（每张图按此填写，英文效果更稳定）

商品图：
```
Photorealistic e-commerce product photo of [商品外观描述，来自商品表], colour [颜色], [镜头要求，来自第4步对应序号].
Shot on a 50mm lens, f/4, soft studio lighting, clean modern UK retail style, square 1:1.
No logos, no brand marks, no readable text or labels, no human faces.
```

买家秀：
```
Casual smartphone photo taken by a customer at home in the UK, showing [商品外观描述] [使用状态/评价内容],
on [背景：e.g. a crumpled bed sheet / wooden kitchen table / grey carpet], natural indoor light, slightly tilted framing, mild phone-camera noise, square 1:1.
No logos, no brand marks, no readable text, no human faces.
```

### 7. 工作流程

1. **先做样板**：只做 `f2`（羽绒服）、`d1`（咖啡豆）、`l2`（台灯）三个商品的全部图片（含 `l2c0`、`f2c0` 两条指定评价），发给我确认风格后再继续。
2. **分批完成**：每批 3–5 个商品，按商品表顺序进行。如果你的生图次数有限，优先完成这些演示重点商品：f1, f2, f3, f4, d1, d2, e4, e5, y1, l1, l2, k1, k2, b2, s2, t1；颜色主图可以最后做或省略。
3. **登记清单**：每完成一个商品，在 `img/manifest.js` 的 `PHOTO_MANIFEST` 中加一条，格式如下（不要改动文件里的其他内容）：
```js
export const PHOTO_MANIFEST = {
  f2: {
    product: ['img/products/f2/1.jpg', 'img/products/f2/2.jpg', 'img/products/f2/3.jpg', 'img/products/f2/4.jpg', 'img/products/f2/5.jpg'],
    colors:  { Navy: 'img/products/f2/color-navy.jpg', Olive: 'img/products/f2/color-olive.jpg' },
    buyer:   ['img/reviews/f2/1.jpg', 'img/reviews/f2/2.jpg', 'img/reviews/f2/3.jpg'],
    reviews: { f2c0: ['img/reviews/f2/f2c0-1.jpg'] },
  },
  // d1: { … }, l2: { … },
};
```
   - `colors` 的键必须与商品表中的颜色名**完全一致**（大小写、空格相同）。
   - 键名用**基础商品 ID**（f1、d1…）；带 `v` 的同款商品（如 `f2v3`）会自动共用这些图片，不要单独登记。
4. **更新说明**：在 `README.md` 的「常见修改」下加一句：“商品图与买家秀为 ChatGPT 生成的 AI 模拟图片，不含真实品牌；已接入的商品见 `img/manifest.js`。”
5. **检查**（每批完成后）：
   - 文件路径与 manifest 中写的路径逐一对应，大小写一致；
   - 抽查 3 张图：无 logo、无可读文字、无清晰人脸、颜色与件数符合商品表；
   - 如果能运行代码：在仓库根目录运行 `python3 -m http.server 8000`，打开 `http://localhost:8000/#/product/f2`，确认图集与买家秀显示新图片、浏览器控制台无报错。
6. **推送到 GitHub**：
   - 新建分支 `feature/ai-photos`，提交信息写明本批完成了哪些商品，例如：`Add AI-generated photos for f2, d1, l2`；
   - 推送后发起 Pull Request 到 `main`，在描述中列出已完成的商品 ID 和检查结果；
   - **如果你无法直接访问或推送 GitHub**：把 `img/` 文件夹（含 manifest.js）打包成 zip 给我，并附上我需要在本地执行的命令：
```bash
git checkout -b feature/ai-photos
# 解压 zip 覆盖仓库中的 img/ 文件夹
git add img README.md
git commit -m "Add AI-generated photos for <商品ID列表>"
git push -u origin feature/ai-photos
```

### 8. 验收标准

- 每个已完成商品：5 张商品图 + 3–4 张公共买家秀，评价表中的指定评价各有对应照片；
- 所有图片符合第 2 步规则；
- manifest 中每条路径都能打开；网站中该商品的列表卡片、详情页图集、买家秀全部显示新图片；
- 未完成的商品仍正常显示插画，网站无报错。

---

### 附表 A：商品表（41 个基础商品，出图依据）

| ID | 品类 | 商品名 | 商品简介与外观要点 | 颜色（每色一张主图） |
|---|---|---|---|---|
| f1 | fashion / Shoes | Kestrun AirFlow Running Trainers | Lightweight daily trainer with responsive cushioning. Free returns on all sizes. 尺码 UK 5–UK 11；版型：True to size；材质/成分：Engineered mesh, foam midsole | Black, White, Volt |
| f2 | fashion / Coats & Jackets | Norhaven Packable Down Jacket | Packs into its own pocket. Warm to around −5°C. 尺码 XS–XXL；版型：Runs small — size up；材质/成分：90/10 down, recycled nylon | Black, Navy, Olive |
| f3 | fashion / Knitwear | Merino Wool Crew Jumper | Soft fine-gauge merino. Breathable and itch-free. 尺码 S–XL；版型：True to size；材质/成分：100% merino wool | Oatmeal, Charcoal, Forest |
| f4 | fashion / T-shirts | Everyday Cotton Tee (3-pack) | Heavyweight basics that keep their shape wash after wash. 尺码 XS–XXL；版型：Runs large — consider sizing down；材质/成分：100% combed cotton, 180 gsm | White, Black, Grey marl |
| f5 | fashion / Bags | Maison Ardel Leather Tote | Fits a 14" laptop. Hand-finished edges, inner zip pocket. 尺寸 38×14×30 cm；材质/成分：Full-grain leather | Tan, Black |
| f6 | fashion / Activewear | Thermal Leggings (2-pack) | Fleece-lined for cold commutes and winter walks. 尺码 XS–XL；版型：True to size；材质/成分：Brushed polyester, elastane | Black |
| d1 | food / Coffee & Tea | Single-Origin Coffee Beans 1 kg | Notes of chocolate and caramel. Roasted in the UK each week. 净含量 1 kg；材质/成分：100% Arabica, Colombia | — |
| d2 | food / Chocolate & Sweets | Belgian Chocolate Selection Box 500 g | A gift-boxed assortment of 42 pralines and truffles. 净含量 500 g；材质/成分：42 assorted pralines | — |
| d3 | food / Coffee & Tea | Ceremonial Matcha Powder 100 g | Bright green, smooth and not bitter. Makes about 50 cups. 净含量 100 g；材质/成分：Stone-ground, Uji (Japan) | — |
| d4 | food / Snacks | Mixed Nuts & Dried Fruit 1 kg | Resealable pouch of unsalted nuts with raisins and cranberries. 净含量 1 kg；材质/成分：Unsalted, no added sugar | — |
| d5 | food / Snacks | Asian Instant Noodle Variety Box (12) | Six flavours, two of each — from mild miso to fire chicken. 净含量 12 × 120 g；材质/成分：6 flavours from Korea, Japan and Thailand | — |
| l1 | home / Lighting | Lumi Bedside Touch Lamp | 3-level touch dimming with a warm 2700K glow. UK 3-pin plug, no adapter needed. 尺寸 12×12×28 cm；英标三脚插头；材质/成分：ABS base, linen shade | Oat, Charcoal, Sage |
| l2 | home / Lighting | Arc Minimal Desk Lamp | Adjustable arm with 5 colour temperatures. Ships with a European 2-pin plug. 尺寸 15×15×42 cm；欧标两脚插头；材质/成分：Aluminium | Black, White |
| l3 | home / Lighting | Glow LED Strip Lights 5 m | App and remote control, music sync. Powered by any USB port. 尺寸 500×1×0.2 cm；USB 供电；材质/成分：Silicone-coated LED | — |
| s1 | home / Storage | Under-Bed Storage Bags (2-pack) | Fits beds with 16 cm clearance or more. Reinforced handles, zip lid. 尺寸 100×50×15 cm；材质/成分：Non-woven fabric, clear window | Grey, Beige |
| s2 | home / Storage | Slim Under-Bed Box with Wheels | Rolling under-bed box with lid. Needs at least 19 cm under your bed. 尺寸 80×45×18 cm；材质/成分：PP plastic | — |
| s3 | home / Storage | Foldable Fabric Cubes (6-pack) | 30 cm cubes that fit standard cube shelving units. 尺寸 30×30×30 cm；材质/成分：Fabric, cardboard base | Grey, Navy, Cream |
| b1 | home / Bedding | Microfibre Duvet 10.5 Tog — Double | UK double size (200 × 200 cm). Machine washable. 尺寸 200×200×3 cm；材质/成分：Microfibre, hollowfibre fill | White |
| b2 | home / Bedding | Cotton Bedding Set — King | Duvet cover 230 × 220 cm (US king) with two pillowcases. 尺寸 230×220×1 cm；材质/成分：100% cotton, 200 thread count | White, Sage, Blush |
| h1 | home / Bathroom | Quick-Dry Towel Set (6 pcs) | 2 bath sheets, 2 hand towels, 2 face cloths. 尺寸 140×70×1 cm；材质/成分：100% cotton, 550 gsm | White, Grey, Sage |
| h3 | home / Bathroom | Memory Foam Bath Mat | Super absorbent, machine washable at 30°C. 尺寸 80×50×1.5 cm；材质/成分：Velvet top, non-slip base | Grey, Cream, Navy |
| k1 | kitchen / Kettles | Rapid Boil 1.7 L Electric Kettle | 3 kW fast boil for UK sockets. Boil-dry protection, limescale filter. 尺寸 22×15×25 cm；英标三脚插头；材质/成分：Stainless steel | Silver, Matte Black |
| k2 | kitchen / Kettles | Glass Kettle with Blue LED 1.8 L | Blue LED while boiling. Ships with a European plug. 尺寸 23×16×26 cm；欧标两脚插头；材质/成分：Borosilicate glass | — |
| k3 | kitchen / Cookware | Hearthly Non-stick Pan Set (3 pcs) | 20/24/28 cm pans for gas, electric and induction. 10-year guarantee. 尺寸 28×28×5 cm；材质/成分：Forged aluminium, ceramic coating | Graphite, Sage |
| k4 | kitchen / Storage | Airtight Food Containers (10-pack) | Stackable, dishwasher-safe, with labels and a marker pen. 尺寸 20×14×10 cm；材质/成分：BPA-free plastic, silicone seal | — |
| e4 | electronics / Audio | Sonaro ANC Wireless Headphones | Adaptive noise cancelling, 40-hour battery, multipoint Bluetooth 5.3. USB 供电；材质/成分：Aluminium, protein leather | Black, Silver, Midnight Blue |
| e5 | electronics / Audio | True Wireless Earbuds Pro | Bluetooth 5.3, IPX5 sweat-proof, touch controls. USB 供电；材质/成分：ABS | White, Black |
| e6 | electronics / Wearables | Fitness Smartwatch with Heart Rate | 100+ sport modes, sleep tracking, works with iPhone and Android. USB 供电；材质/成分：Aluminium, silicone strap | Black, Pink, Silver |
| e7 | electronics / Power & Charging | 10,000 mAh Slim Power Bank | Charges a phone twice. Airline cabin safe. 尺寸 10×6.5×1.5 cm；USB 供电；材质/成分：Aluminium | Black, White |
| e1 | electronics / Power & Charging | 4-Way Extension Lead with USB | 2 m cable, 4 UK sockets + 2 USB-A + 1 USB-C. Fused UK plug. 尺寸 30×6×4 cm；英标三脚插头；材质/成分：Fire-retardant PC | White |
| e3 | electronics / Power & Charging | 65W GaN USB-C Charger | Charges a laptop and phone at once. Foldable UK pins. 尺寸 5×3×6 cm；英标三脚插头；材质/成分：PC | White, Black |
| y1 | beauty / Skincare | Aurevia Hyaluronic Hydrating Serum 30 ml | Lightweight serum for plump, hydrated skin. Fragrance-free. 容量 30 ml；材质/成分：Hyaluronic acid 2%, vitamin B5 | — |
| y2 | beauty / Skincare | Daily SPF 50 Sunscreen 50 ml | No white cast, works under make-up. 容量 50 ml；材质/成分：Broad spectrum UVA/UVB | — |
| y3 | beauty / Hair | Hot Air Styler Brush | Dries and styles in one step, 3 heat settings, UK plug. 英标三脚插头；材质/成分：Ceramic-coated barrel | Rose Gold, Black |
| p1 | sports / Yoga & Fitness | Kestrun Pro Yoga Mat 6 mm | Non-slip grip even when wet. Comes with a carry strap. 尺寸 183×61×0.6 cm；材质/成分：Natural rubber, PU top | Black, Sage, Lilac |
| p2 | sports / Yoga & Fitness | Adjustable Dumbbells 2 × 10 kg | Spin-lock plates from 2.5 kg to 10 kg per hand. 尺寸 38×15×15 cm；材质/成分：Cast iron, rubber coating | Black |
| p3 | sports / Outdoor | Insulated Steel Water Bottle 750 ml | Cold for 24 h, hot for 12 h. Leak-proof lid. 尺寸 8×8×27 cm；材质/成分：18/8 stainless steel | Black, Sage, Sky, Coral |
| t1 | travel / Luggage | Hard-Shell Cabin Suitcase 55 cm | 55 × 40 × 20 cm fits most airline cabin limits. TSA lock. 尺寸 55×40×20 cm；材质/成分：Polycarbonate, 4 spinner wheels | Black, Silver, Navy |
| t2 | travel / Car | Magnetic Car Phone Mount | Clips to air vents. Works with magnetic phone cases. 尺寸 7×7×9 cm；材质/成分：Aluminium, N52 magnets | Black |
| t3 | travel / Travel Accessories | Universal Travel Adapter (UK to EU/US) | One adapter for 150+ countries. Built-in fuse. 尺寸 6×5×5 cm；英标三脚插头；材质/成分：PC | White |
| t4 | travel / Travel Accessories | Compression Packing Cubes (6-pack) | Zip compression saves about 30% space in your case. 尺寸 40×30×10 cm；材质/成分：Ripstop nylon | Grey, Navy |

### 附表 B：需要单独出图的评价（买家秀必须体现评价内容）

| 评价 ID | 商品 | 评价原文 | 照片必须体现 |
|---|---|---|---|
| l2c0 | l2 Arc Minimal Desk Lamp | Nice lamp but it came with a European plug. Had to buy an adapter the same day. | 台灯的欧标两脚插头插在一个白色英标转换头上，放在书桌边 |
| k2c0 | k2 Glass Kettle with Blue LED 1.8 L | EU plug and only 2200W, so it is slower than my old kettle. Looks nicer in the photos. | 厨房台面上的玻璃水壶，底座电线末端是欧标两脚插头；灯光偏暗、比商品图朴素 |
| b2c0 | b2 Cotton Bedding Set — King | Duvet cover is bigger than a UK king — it swims on my duvet. Check the size! | 床上的被套明显比被芯大，边角空荡、布料堆叠下垂 |
| f2c0 | f2 Norhaven Packable Down Jacket | Gorgeous and really warm, but size up — my usual M was tight over a jumper. | 穿在针织衫外的羽绒服，前襟拉链处略紧、布料被撑开（不露脸，镜子自拍或他人拍上半身） |

> 说明：表中所有商品名、品牌名、店铺名都是虚构的，画面中**不要**出现这些名字。
