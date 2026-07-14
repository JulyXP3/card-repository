# 感染卡部件

当前版本: v1.0

生成命令:

```powershell
node infection_card/build_assets.mjs
```

输出目录: `infection_card/dist/`

导入顺序:

1. `01-worldbook-core.json`: 世界书页面导入。包含 InitVar、变量更新规则、读取变量、地图、时间、怪物和主线总控。
2. `02-worldbook-factions-items.json`: 世界书页面导入。包含地区介绍、势力和关键物品。
3. `03-worldbook-npcs.json`: 世界书页面导入。当前是人物档案骨架，正式四声部详稿后续替换。
4. `04-worldbook-quests-openings.json`: 世界书页面导入。包含人物支线、区域事件和六身份开场。
5. `05-mvu-loader-script.json`: 酒馆助手脚本库导入并启用。
6. `06-mvu-schema-script.json`: 酒馆助手脚本库导入并启用；改 schema 后重载脚本并重开对话。
7. `07-regex-01-hide-current-variables.json`: 扩展→正则导入，隐藏读取变量块。
8. `08-regex-02-statusbar-remote.json`: 扩展→正则导入，远程加载状态栏。
9. `09-regex-03-opening-selector-remote.json`: 扩展→正则导入，远程加载开场选择器。
10. `10-regex-04-statusbar-local-disabled.json`: 扩展→正则导入，本地测试备用，默认 disabled。
11. `11-regex-05-opening-selector-local-disabled.json`: 扩展→正则导入，本地测试备用，默认 disabled。
12. `12-regex-06-hide-placeholders-from-ai.json`: 扩展→正则导入，对 AI 隐藏前端占位符。

状态栏草案: `infection_card/statusbar/index.html`

开场选择器草案: `infection_card/opening_selector/index.html`

状态栏视觉方向来自 ui-ux-pro-max: 深色优先、密集仪表盘、低动效、可读性和触控目标优先。

状态栏接入说明:

- `statusbar/index.html` 是酒馆助手 iframe 前端源码。
- 发布前需要把 `statusbar/` 和 `opening_selector/` 部署到可访问的静态 URL。
- 设置 `FRONTEND_BASE_URL` 后重新生成，远程正则会自动启用并写入该 URL。

开场选择器说明:

- 选择器提供六个预设身份和一个自定义身份。预设身份点击“开始”后发送 `开始, 身份名`；自定义身份点击“开始”后发送 `开始, 请根据以下提供的信息开局` 和表单内容。
- 优先使用 `triggerSlash('/setinput ...')` 写入输入框，再点击发送按钮。
- 如果自动发送 API 不可用，会降级直接写入输入框。

前端部署说明:

- 远程构建示例：`$env:FRONTEND_BASE_URL="https://example.com/infection_card"; node infection_card/build_assets.mjs`
- 远程 URL 生成后，`08` 和 `09` 正则 enabled。
- 未设置 `FRONTEND_BASE_URL` 时，`08` 和 `09` 会 disabled，避免导入无效地址。
- 本地测试可启用 `10` 和 `11`，并用静态服务提供 `http://localhost:5500/infection_card/...`。

使用注意:

- 选择栏不在本卡内实现，由你的酒馆预设承担。
- 摘要/长期记忆不在 MVU 内实现，由你的记忆插件承担。
- 世界书重导入不会更新 schema；schema 脚本变更后需要重载脚本并重开对话。
