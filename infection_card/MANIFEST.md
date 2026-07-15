# 感染部件清单 v1.0

## 世界书

1. `dist/01-worldbook-core.json`
   - 导入位置：SillyTavern 世界书页面
   - 内容：InitVar、变量更新规则、读取变量 EJS、演绎规则、状态栏占位符输出规则、地图、时间、怪物、主线总控
   - 注意：`[InitVar]感染变量初始化勿开` 必须保持 disabled

2. `dist/02-worldbook-factions-items.json`
   - 导入位置：SillyTavern 世界书页面
   - 内容：七个地区介绍、六大势力、五个关键物品

3. `dist/03-worldbook-npcs.json`
   - 导入位置：SillyTavern 世界书页面
   - 内容：10 个四声部人物档案、独眼与徒弟网络

4. `dist/04-worldbook-quests-openings.json`
   - 导入位置：SillyTavern 世界书页面
   - 内容：10 条人物支线、远方归来通用入口、6 个身份开场、区域事件池
   - 注意：身份开场使用“身份名 + 开始”双键触发，选择器会发送“开始, 身份名, 推进剧情”；自定义身份使用“请根据以下提供的信息开局 + 开始”触发

## 脚本

5. `dist/05-mvu-loader-script.json`
   - 导入位置：酒馆助手 → 脚本库
   - 用途：加载 MVU 本体

6. `dist/06-mvu-schema-script.json`
   - 导入位置：酒馆助手 → 脚本库
   - 用途：注册 stat_data schema
   - 注意：schema 改动后重载脚本并重开对话

## 正则

7. `dist/07-regex-01-hide-current-variables.json`
   - 导入位置：扩展 → 正则
   - 用途：隐藏读取变量块

8. `dist/08-regex-02-statusbar-remote.json`
   - 导入位置：扩展 → 正则
   - 用途：远程加载状态栏前端
   - 默认：设置 `FRONTEND_BASE_URL` 生成时 enabled；未设置时 disabled

9. `dist/09-regex-03-opening-selector-remote.json`
   - 导入位置：扩展 → 正则
   - 用途：远程加载开场选择器前端
   - 默认：设置 `FRONTEND_BASE_URL` 生成时 enabled；未设置时 disabled

10. `dist/10-regex-04-statusbar-local-disabled.json`
    - 导入位置：扩展 → 正则
    - 用途：本地加载状态栏前端测试备用
    - 默认：disabled

11. `dist/11-regex-05-opening-selector-local-disabled.json`
    - 导入位置：扩展 → 正则
    - 用途：本地加载开场选择器前端测试备用
    - 默认：disabled

12. `dist/12-regex-06-hide-placeholders-from-ai.json`
    - 导入位置：扩展 → 正则
    - 用途：对 AI 隐藏前端占位符

## 前端源码

- `statusbar/index.html`
  - 状态栏源码
  - 与开场选择器分离

- `opening_selector/index.html`
  - 开场选择器源码
  - 身份按钮只切换预览；点击底部“开始”后才发送开场文本

## 卡文本

- `card_texts.md`
  - 卡字段建议
  - README 开场页
  - 起手页
  - 六预设身份开场白和自定义身份说明

## 完整角色卡

- `dist/infection-card-v1.0.json`
  - 完整 V3 角色卡 JSON
  - 内嵌世界书、酒馆助手脚本、正则、README 开场页和起手页
