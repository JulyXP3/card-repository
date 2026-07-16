import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL(".", import.meta.url).pathname.replace(/^\//, "");
const dist = join(root, "dist");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const worldbookFiles = [
  "01-worldbook-core.json",
  "02-worldbook-factions-items.json",
  "03-worldbook-npcs.json",
  "04-worldbook-quests-openings.json",
];

const entries = worldbookFiles.flatMap((file) =>
  Object.values(readJson(join(dist, file)).entries),
);
const comments = entries.map((entry) => entry.comment);
assert(
  comments.includes("[InitVar]感染变量初始化勿开"),
  "missing renamed InitVar entry",
);

for (const region of [
  "地区-努尔山脉",
  "地区-新都",
  "地区-11区",
  "地区-11区郊外",
  "地区-封锁线",
  "地区-联邦沦陷区",
  "地区-伊甸港",
]) {
  assert(comments.includes(region), `missing region lore: ${region}`);
}

for (const entry of entries.filter((item) =>
  item.comment.startsWith("区域事件-"),
)) {
  assert(
    !entry.content.includes("地区: 沿江医院\n"),
    `${entry.comment} treats 沿江医院 as a region`,
  );
  assert(
    !entry.content.includes("地区: 韦斯特研究所\n"),
    `${entry.comment} treats 韦斯特研究所 as a region`,
  );
  for (const section of [
    "触发画面:",
    "核心矛盾:",
    "可互动对象:",
    "处理方向:",
    "收益/代价:",
    "变量提示:",
    "一次性规则:",
  ]) {
    assert(
      entry.content.includes(section),
      `${entry.comment} missing section: ${section}`,
    );
  }
}

for (const name of [
  "[EJS]主线阶段控制器",
  "[EJS]支线阶段控制器",
  "[EJS]区域事件判定池",
  "[EJS]天气昼夜怪物压力池",
  "[mvu_update]变量输出格式(gemini/ds/kimi/glm)",
  "[mvu_update]变量输出格式强调",
  "变量列表（读取变量）",
]) {
  assert(comments.includes(name), `missing worldbook entry: ${name}`);
}

const openingEntries = entries.filter((item) =>
  item.comment.startsWith("开场-"),
);
assert(
  openingEntries.length === 1,
  `expected 1 opening entry (custom identity only), got ${openingEntries.length}`,
);
assert(
  openingEntries[0].comment === "开场-自定义身份开场规则",
  "only remaining opening entry should be custom identity rule",
);
assert(
  comments.includes("开场-自定义身份开场规则"),
  "missing custom identity opening rule",
);
const customOpeningRule = entries.find(
  (entry) => entry.comment === "开场-自定义身份开场规则",
);
assert(
  customOpeningRule.content.includes("努尔山脉、新都、11区、封锁线、伊甸港"),
  "custom identity rule missing safe opening regions",
);
assert(
  !customOpeningRule.content.includes("努尔山脉、新都、11区郊外"),
  "custom identity rule still suggests 11区郊外",
);
assert(
  customOpeningRule.content.includes("不得把自定义身份直接开在11区郊外"),
  "custom identity rule missing forbidden core-region guard",
);

const mapEntry = entries.find((entry) => entry.comment === "地图-简易地图");
assert(
  mapEntry.content.includes("韦斯特研究所位于11区郊外，不是地区"),
  "map does not clarify 韦斯特研究所 as faction site",
);
assert(
  mapEntry.content.includes("沿江医院营地位于11区，不是地区"),
  "map does not clarify 沿江医院营地 as faction site",
);

const disabledNames = [
  "主线-远方归来",
  "主线-水源里的旧事故",
  "主线-拓展 J 的名字",
  "主线-封锁不是救援",
  "主线-食蚁兽没有停止",
  "主线-黑光-III",
  "主线-真相之后",
  "支线-观察期",
  "支线-缺口",
  "支线-封锁线以北",
  "支线-失败样本",
  "支线-不能被写进损耗栏的人",
  "支线-上帝是否动摇",
  "支线-焦虑",
  "支线-抉择",
  "支线-账本里的死路",
  "支线-不该进去的地方",
];

const controlled = (entry) =>
  disabledNames.includes(entry.comment) ||
  entry.comment.startsWith("区域事件-") ||
  entry.comment.startsWith("环境压力-") ||
  entry.comment.startsWith("怪物压力-");

const triggerableControlled = entries.filter(
  (entry) =>
    controlled(entry) &&
    (entry.enabled || !entry.disable || (entry.key && entry.key.length)),
);
assert(
  !triggerableControlled.length,
  `controlled entries still triggerable: ${triggerableControlled.map((entry) => entry.comment).join(", ")}`,
);

const schema = readJson(join(dist, "06-mvu-schema-script.json")).content;
for (const field of [
  "registerMvuSchema(Schema)",
  "local_events",
  "day_period",
  "weather",
  "z.string().transform(name => ({ name }))",
]) {
  assert(schema.includes(field), `schema missing: ${field}`);
}

const statusbar = readFileSync(join(root, "statusbar", "index.html"), "utf8");
const script = statusbar.match(/<script>([\s\S]*)<\/script>/);
assert(script, "statusbar script tag missing");
new Function(script[1]);
assert(
  statusbar.includes("time.day_period"),
  "statusbar missing day_period display",
);
assert(statusbar.includes("time.weather"), "statusbar missing weather display");
assert(!statusbar.includes("阶段闸门"), "statusbar still displays phase gate");
assert(
  !statusbar.includes("未读取到最新变量，当前显示安全占位数据。"),
  "statusbar still shows fallback placeholder notice",
);
assert(
  statusbar.includes('searchParams.get("demo") === "50"'),
  "statusbar missing demo=50 gate",
);
assert(
  statusbar.includes("for (let i = 1; i <= 50; i += 1)"),
  "statusbar demo data must create 50 NPCs",
);

const openingSelector = readFileSync(
  join(root, "opening_selector", "index.html"),
  "utf8",
);
const openingScript = openingSelector.match(/<script>([\s\S]*)<\/script>/);
assert(openingScript, "opening selector script tag missing");
new Function(openingScript[1]);
assert(
  !openingSelector.includes("开始游戏"),
  "opening selector still mentions 开始游戏",
);
assert(
  !openingSelector.includes("我从远方回来"),
  "opening selector still mentions old immersive phrase",
);
assert(
  !openingSelector.includes("sendOpening"),
  "opening selector still sends immediately on identity click",
);
assert(
  openingSelector.includes("switchToGreeting"),
  "opening selector missing greeting switching function",
);
assert(
  openingSelector.includes("identityToSwipe"),
  "opening selector missing swipe index mapping",
);
assert(
  openingSelector.includes("野外生存博主: 2") &&
    openingSelector.includes("海岛灯塔看守: 6"),
  "opening selector swipe mapping must match identity alternate greetings",
);
assert(
  openingSelector.includes('createChatMessages([{ role: "user", message }]') &&
    openingSelector.includes('triggerSlash("/trigger")') &&
    !openingSelector.includes('triggerSlash("/send")'),
  "custom identity must create one user message, then trigger generation",
);
assert(
  openingSelector.includes("开始, 请根据以下提供的信息开局"),
  "opening selector missing custom opening phrase",
);
for (const region of [
  "<option>努尔山脉</option>",
  "<option>新都</option>",
  "<option>11区</option>",
  "<option>封锁线</option>",
  "<option>伊甸港</option>",
]) {
  assert(
    openingSelector.includes(region),
    `opening selector missing custom location option: ${region}`,
  );
}
assert(
  !openingSelector.includes("可选：努尔山脉 / 新都 / 11区郊外"),
  "opening selector still suggests 11区郊外",
);
assert(
  !openingSelector.includes(
    "可选：努尔山脉 / 新都 / 11区 / 封锁线 / 联邦沦陷区",
  ),
  "opening selector still suggests federal fallen zone",
);
assert(
  !openingSelector.includes("填写越具体，AI 越容易稳定建档"),
  "opening selector still shows removed location hint",
);
assert(
  openingSelector.includes('<select id="customPlace">'),
  "custom opening location must be a select",
);
assert(
  !openingSelector.includes('<input id="customPlace"'),
  "custom opening location must not be free text",
);
for (const field of [
  "身份/职业",
  "开场地点",
  "随身物品",
  "独特技能",
  "经历介绍",
  "样貌穿搭",
]) {
  assert(
    openingSelector.includes(field),
    `opening selector missing custom field: ${field}`,
  );
}
assert(
  openingSelector.includes("将切换至："),
  "opening selector missing greeting switch status message",
);

const localOpeningRegex = readJson(
  join(dist, "11-regex-05-opening-selector-local-disabled.json"),
);
const remoteStatusbarRegex = readJson(join(dist, "08-regex-02-statusbar-remote.json"));
const remoteOpeningRegex = readJson(join(dist, "09-regex-03-opening-selector-remote.json"));
assert(!remoteStatusbarRegex.disabled, "remote statusbar regex should be enabled");
assert(!remoteOpeningRegex.disabled, "remote opening selector regex should be enabled");
assert(
  remoteStatusbarRegex.replaceString.includes(
    "https://julyxp3.github.io/card-repository/infection_card/statusbar/index.html",
  ),
  "remote statusbar regex should use GitHub Pages URL",
);
assert(
  remoteOpeningRegex.replaceString.includes(
    "https://julyxp3.github.io/card-repository/infection_card/opening_selector/index.html",
  ),
  "remote opening selector regex should use GitHub Pages URL",
);
assert(
  localOpeningRegex.replaceString.includes("opening_selector/index.html") &&
    !localOpeningRegex.replaceString.includes("?v="),
  "local opening regex should not include version query",
);

const card = readJson(join(dist, "infection-card-v1.1.json"));
assert(card.data.character_version === "1.1.0", "card character_version should be 1.1.0");
assert(
  card.first_mes === "<OpeningSelectorImpl/>" &&
    card.data.first_mes === "<OpeningSelectorImpl/>",
  "first_mes should be the opening selector only",
);
assert(
  !card.data.alternate_greetings.join("\n").includes("远方的信号重新落进死寂的空气里"),
  "starter still uses old distant-signal wording",
);
assert(
  card.data.alternate_greetings.length === 6,
  `expected 6 alternate greetings (identities only), got ${card.data.alternate_greetings.length}`,
);
assert(
  card.name === "感染" && card.data.name === "感染",
  "card name not renamed to 感染",
);
assert(
  card.data.character_book.entries.length === entries.length,
  "embedded card entry count mismatch",
);
assert(
  card.data.extensions.regex_scripts.length === 7,
  "embedded regex count mismatch",
);
assert(
  card.data.extensions.tavern_helper.scripts.length === 3,
  "embedded helper scripts count mismatch (expected 3: loader + schema + greeting-init)",
);

const greetingInit = card.data.extensions.tavern_helper.scripts.find(
  (s) => s.id === "infection-greeting-init-v110",
);
assert(greetingInit, "missing greeting init helper script");

console.log(`verify ok: ${entries.length} worldbook entries, 7 regex scripts, 3 helper scripts`);
