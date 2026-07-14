# 感染发布检查单 v0.1.0

## 发布包必须包含

- `dist/infection-card-v0.1.0.json`

## 部件分发可选包含

- `dist/01-worldbook-core.json`
- `dist/02-worldbook-factions-items.json`
- `dist/03-worldbook-npcs.json`
- `dist/04-worldbook-quests-openings.json`
- `dist/05-mvu-loader-script.json`
- `dist/06-mvu-schema-script.json`
- `dist/07-regex-01-hide-current-variables.json`
- `dist/08-regex-02-statusbar-remote.json`
- `dist/09-regex-03-opening-selector-remote.json`
- `dist/10-regex-04-statusbar-local-disabled.json`
- `dist/11-regex-05-opening-selector-local-disabled.json`
- `dist/12-regex-06-hide-placeholders-from-ai.json`
- `card_texts.md`
- `MANIFEST.md`
- `README.md`
- `SMOKE_TEST.md`

## 发布包可选包含

- `statusbar/index.html`
- `opening_selector/index.html`
- `build_assets.mjs`

可选文件用于后续维护和再生成。玩家只导入 `dist` 下 JSON 和查看文档即可运行。

## 导入后检查

1. 世界书四个 JSON 都能导入。
2. `[InitVar]感染变量初始化勿开` 保持 disabled。
3. `读取变量` 条目无 `[mvu_plot]` 或 `[mvu_update]` 前缀。
4. 酒馆助手脚本库中启用 MVU 加载器和变量结构脚本。
5. 正则按编号顺序导入。
6. 起手页包含 `<OpeningSelectorImpl/>` 和 `<StatusPlaceHolderImpl/>`。
7. 远程 URL 或本地测试服务可访问，开场选择器能加载。
8. 剧情开始后的 AI 回复末尾继续输出 `<StatusPlaceHolderImpl/>`。
9. 状态栏显示已选身份、生存状态、背包、人物、势力、主线和技能。
10. 按 `SMOKE_TEST.md` 跑一轮开场、状态栏、MVU、怪物时期锁和主线证据闸门测试。

## 不做项

- 不内联前端 HTML；前端按酒馆助手 iframe 标准部署。
- 正式发布需要静态托管；本地测试需要静态服务。
- 不需要选择栏，交给用户酒馆预设。
- 不需要 MVU 内置长期摘要，交给用户记忆插件。
