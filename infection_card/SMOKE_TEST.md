# 感染导入与冒烟测试 v1.0

## 1. 导入顺序

1. 世界书页面导入：
   - `dist/01-worldbook-core.json`
   - `dist/02-worldbook-factions-items.json`
   - `dist/03-worldbook-npcs.json`
   - `dist/04-worldbook-quests-openings.json`

2. 酒馆助手脚本库导入并启用：
   - `dist/05-mvu-loader-script.json`
   - `dist/06-mvu-schema-script.json`

3. 扩展 → 正则，按编号导入：
   - `dist/07-regex-01-hide-current-variables.json`
   - `dist/08-regex-02-statusbar-remote.json`
   - `dist/09-regex-03-opening-selector-remote.json`
   - `dist/10-regex-04-statusbar-local-disabled.json`
   - `dist/11-regex-05-opening-selector-local-disabled.json`
   - `dist/12-regex-06-hide-placeholders-from-ai.json`

4. 新开聊天。

5. 如果 schema 脚本刚导入或修改过，重载脚本并重开对话。

## 2. 导入后静态检查

- `[InitVar]感染变量初始化勿开` 必须是 disabled。
- `读取变量` 条目必须无 `[mvu_plot]` 或 `[mvu_update]` 前缀。
- 正则列表顺序必须从 `01` 到 `06`。
- 正式发布时 `08` 和 `09` 应为 enabled，且 URL 可访问。
- 未设置 `FRONTEND_BASE_URL` 生成时，`08` 和 `09` 为 disabled 是正常状态。
- 本地测试时只启用 `10` 和 `11`，不要同时启用远程和本地加载正则。
- 起手页应包含 `<OpeningSelectorImpl/>` 和 `<StatusPlaceHolderImpl/>`。

## 3. 开场选择器测试

在起手页点击任一身份按钮，确认下方面板先显示开场正文，不应立刻发送。

期望：

- 点击身份按钮只切换预览面板；点击底部“开始”后，选择器折叠成“已开始：身份名”。
- 预设身份点击“开始”后自动发送 `开始, 身份名, 推进剧情`；如果自动发送失败，应写入输入框。
- 只触发对应身份开场，不触发其他五个身份开场。
- 后续楼层不再出现开场选择器。

推荐测试身份：

```text
开始, 看火人, 推进剧情
```

期望开场要点：努尔山脉-旧防火瞭望塔、无线电、旧式步枪、防火斧、山下感染者迁移。

自定义身份测试：

```text
开始, 请根据以下提供的信息开局
身份/职业: 废弃电台维修员
开场地点: 11区旧广播塔
随身物品: 维修工具、旧电台、半盒电池、短刀
独特技能: 修理无线电、辨识旧军方频段、临时布线
经历介绍: 灾难后一直在广播塔附近监听残余频道，最近收到一段指向新都的短讯。
样貌穿搭: 旧防水外套、工具腰包、手背有烧伤痕迹
```

期望：AI 按输入现场生成开场，并初始化身份、地点、技能和背包。

## 4. 状态栏测试

期望：

- `<StatusPlaceHolderImpl/>` 被替换成状态栏。
- `状态` Tab 显示两栏：左侧生存状态，右侧身份技能。
- 状态栏不显示六个身份按钮。
- 移动端窄屏不横向滚动。

如果状态栏不显示：

1. 检查 `08-regex-02-statusbar-remote.json` 是否启用，或本地测试时检查 `10-regex-04-statusbar-local-disabled.json` 是否已手动启用。
2. 检查 AI 回复中是否有 `<StatusPlaceHolderImpl/>`。
3. 检查远程 URL 或 `localhost:5500` 本地静态服务是否可访问。
4. 检查 `12-regex-06-hide-placeholders-from-ai.json` 是否只对 prompt 隐藏，不影响显示替换顺序。

## 5. MVU 初始化测试

开场后检查 `stat_data`。

期望：

- `user_profile.origin_identity` 是所选身份。
- `user_profile.current_location` 是对应开场地点。
- `user_profile.skills` 有 2-4 个身份技能。
- `inventory` 有对应初始物品。
- `world_time.period` 是 `沦陷期`。

如果变量没有写入：

1. 检查 MVU 加载器脚本是否启用。
2. 检查变量结构脚本是否启用并重载。
3. 检查 AI 是否输出 `<UpdateVariable><JSONPatch>...</JSONPatch></UpdateVariable>`。
4. 检查 MVU 扩展是否解析当前楼层变量。

## 6. 测试提示词

### 背包更新

```text
我检查背包，把手摇无线电、电池和防火斧整理出来。随后喝掉一瓶水，只留下空瓶。
```

期望：

- 背包显示无线电、电池、防火斧。
- 饮水或普通物品发生合理变化。
- 不出现武器耐久字段。

### NPC 遇见

```text
我抵达新都外围，请守门的人带我去见安娜·陈。我愿意接受观察期任务。
```

期望：

- `npcs.anna_chen.status` 从 `未遇见` 变为已遇见或类似阶段。
- 安娜关系仍应谨慎，不能直接信任。
- 可触发支线 `观察期`，但不应自动完成。

### 支线状态

```text
我接受安娜安排的观察期任务，去协助排查一批短缺的配给物资。
```

期望：

- `quests.active` 增加 `观察期` 或相关阶段。
- `npcs.anna_chen.side_quest` 进入已触发或进行中。
- 不把完整支线剧情流水账塞进变量。

### 怪物时期锁

```text
现在仍是沦陷期。我在山路上听见传闻，说有人看见融合型怪物，但我没有亲眼遭遇。
```

期望：

- 可以写成传闻。
- 不得正式遭遇融合型。
- `monster_knowledge.encountered_types` 不应加入 `融合型`。

### 主线证据闸门

```text
我还没有拿到任何关键物，只是听见有人说军方和研究所有秘密。请继续。
```

期望：

- 可以出现怀疑、传闻、矛盾记录。
- 不得直接揭示食蚁兽计划完整真相。
- 不得把四件关键物刷新到 {{user}} 面前。

### 状态栏持续输出

```text
继续推进当前场景。
```

期望：

- assistant 回复末尾仍单独包含 `<StatusPlaceHolderImpl/>`。
- 正则显示状态栏。
- 下一轮 prompt 中 AI 不应看到占位符原文。

## 7. 失败定位顺序

1. AI 真实输出是否包含变量块或占位符。
2. 正则是否按编号启用。
3. MVU 是否把变量真实落库。
4. 状态栏是否读取到 `stat_data`。
5. 世界书条目是否按 key 触发。

不要先改世界书文本。先确认是哪一层断了。
