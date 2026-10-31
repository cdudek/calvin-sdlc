#!/usr/bin/env node
// Usage: node build.mjs <path-to-ux-patterns-for-developers-clone> [<skill-dir>]
// Converts the uxpatterns.dev MDX content into plain Markdown references for this skill.
// Writes:
//   references/patterns/<category>/<slug>.md   one full pattern, with a section line map on top
//   references/index/<category>.md             chooser index: use for / not for / alternatives
//   references/guides/<slug>.md                comparison guides and "when to use what"
//   references/glossary.md                     all glossary terms
//   SKILL.md                                   master index between the PATTERN INDEX markers
// Evaluates the data literals in the source repo's MDX and TS files: only point it at a clone of
// thedaviddias/ux-patterns-for-developers you trust.
// Fails (exit 1) if a known component survives, a pattern is missing, or an internal link dangles.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SRC = path.resolve(process.argv[2] ?? "");
const SKILL = path.resolve(process.argv[3] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const WEB = path.join(SRC, "apps/web");
const CONTENT = path.join(WEB, "content");
if (!fs.existsSync(CONTENT)) throw new Error(`No apps/web/content under ${SRC}`);
const REF = path.join(SKILL, "references");
const SITE = "https://uxpatterns.dev";

// ---------- data the guides import from TypeScript ----------
function loadTs(file) {
  let src = fs.readFileSync(file, "utf8")
    .replace(/^import type[^;]*;\s*$/gm, "")
    .replace(/^import[^;]*;\s*$/gm, "")
    .replace(/export const (\w+)\s*:\s*[^=]+=/g, "exports.$1 =")
    .replace(/export const (\w+)\s*=/g, "exports.$1 =");
  const exports = {};
  new Function("exports", src)(exports);
  return exports;
}
const scope = {};
const flow = path.join(WEB, "components/decision-flow/data");
const flowNames = {
  "data-display-patterns": "dataDisplay", "input-types": "inputType", "loading-patterns": "loadingPattern",
  "navigation-patterns": "navigation", "overlay-patterns": "overlay", "search-vs-command-palette": "searchVsCommand",
};
for (const [f, p] of Object.entries(flowNames)) {
  const d = loadTs(path.join(flow, `${f}.ts`));
  scope[`${p}Nodes`] = d.nodes; scope[`${p}Edges`] = d.edges;
}
const guideData = path.join(WEB, "lib/pattern-guide-data");
const guideNames = {
  "choosing-input-types": "inputTypes", "loading-patterns": "loadingPatterns", "modal-vs-popover": "modal",
  "pagination-vs-infinite-scroll": "pagination", "search-vs-command-palette": "searchVsCommand", "table-vs-list-vs-cards": "table",
};
for (const [f, p] of Object.entries(guideNames)) {
  const d = loadTs(path.join(guideData, `${f}.ts`));
  for (const [k, v] of Object.entries(d)) scope[`${p}${k[0].toUpperCase()}${k.slice(1)}`] = v;
}
// Any data identifier still missing from scope surfaces as a ReferenceError in evalExpr, with the file named.

// Words people use for a pattern that its slug doesn't contain. Shown in SKILL.md and the chooser
// indexes so "toast" finds `notification`. Keys must be real slugs; the self-check fails otherwise.
const ALIASES = {
  "command-palette": "cmd+k, quick switcher, launcher", "search-results": "results page, SERP",
  wizard: "stepper, multi-step form, onboarding flow", "ai-chat": "chatbot, assistant, conversational UI",
  "ai-error-states": "AI failure, refusal", "ai-loading-states": "thinking indicator",
  "ai-suggestions": "inline completion, smart suggestions", "context-window": "context limit",
  "model-selector": "model picker", "prompt-input": "chat composer, message box",
  "response-feedback": "thumbs up/down", "streaming-response": "typing effect, token streaming",
  "token-counter": "usage meter", "account-settings": "preferences, settings page", login: "sign in",
  "password-reset": "forgot password", signup: "registration, sign up", "social-login": "SSO, OAuth, sign in with Google",
  "two-factor": "2FA, MFA, OTP", "user-profile": "profile page", accordion: "collapsible, disclosure, FAQ",
  carousel: "slideshow, rotating banner", "drag-and-drop": "reorder, sortable", "expandable-text": "read more, truncation",
  modal: "dialog, overlay, confirm dialog", popover: "flyout, contextual panel, dropdown panel", tooltip: "hint, info icon",
  calendar: "scheduler, agenda", "card-grid": "cards, tiles", chart: "graph, data viz",
  "comparison-table": "pricing table, feature matrix", dashboard: "overview, KPIs", "filter-panel": "facets, faceted search, filters",
  "kanban-board": "board, columns", statistics: "KPI tiles, stat cards, metrics", table: "data grid, datatable",
  timeline: "history, changelog", "tree-view": "hierarchy, folder tree, nested list", checkout: "payment flow",
  "product-card": "product tile", "shopping-cart": "basket, mini cart", autocomplete: "typeahead, combobox, suggestions",
  button: "CTA", "code-confirmation": "OTP input, PIN, verification code", "currency-input": "money, amount",
  "date-picker": "calendar input", "date-range": "from-to dates", "file-input": "upload, dropzone",
  "form-validation": "inline errors, error messages", "multi-select-input": "tags picker, recipients, multi-select dropdown",
  password: "show/hide, strength meter", "phone-number": "tel input", radio: "radio buttons, single choice",
  "rating-input": "stars", "rich-text-editor": "WYSIWYG", "search-field": "search bar, search box",
  "selection-input": "select, dropdown", slider: "range input", "tag-input": "chips input, tokens",
  "text-field": "input", textarea: "multi-line input", "time-input": "time picker", toggle: "switch",
  "image-gallery": "lightbox, photo grid", "image-upload": "avatar upload, cropper", "back-to-top": "scroll to top",
  "hambuger-menu": "hamburger menu (upstream spelling), off-canvas, mobile nav", "load-more": "show more",
  megamenu: "mega menu", "navigation-menu": "nav bar, header nav, top nav", pagination: "pager",
  sidebar: "side nav, drawer", tabs: "tab bar, segmented control", "activity-feed": "news feed",
  "comment-system": "comments, threads, replies", "like-button": "reactions", "share-dialog": "share sheet",
  "cookie-consent": "cookie banner, GDPR banner", "empty-states": "blank state, zero state",
  "loading-indicator": "spinner", notification: "toast, snackbar, alert, banner",
  "progress-indicator": "progress bar", skeleton: "skeleton screen, placeholder loading",
};

// ---------- links ----------
function mapLink(href) {
  if (!href || !href.startsWith("/")) return href;
  const [p, anchor] = href.split("#");
  if (/\.\w+$/.test(p)) return SITE + href; // images and other assets stay on the site
  const parts = p.replace(/\/$/, "").split("/").filter(Boolean);
  if (parts[0] === "patterns" && parts.length === 3) return `patterns/${parts[1]}/${parts[2]}.md${anchor ? "#" + anchor : ""}`;
  if (parts[0] === "patterns" && parts.length === 2 && parts[1] === "when-to-use-what") return "guides/when-to-use-what.md";
  if (parts[0] === "patterns" && parts.length === 2 && parts[1] === "getting-started") return "guides/getting-started.md";
  if (parts[0] === "patterns" && parts.length === 2) return `index/${parts[1]}.md`;
  if (parts[0] === "pattern-guide" && parts.length === 2) return `guides/${parts[1]}.md`;
  if (parts[0] === "glossary" && (parts.length === 1 || parts[parts.length - 1] === "index")) return null; // landing page, no term
  if (parts[0] === "glossary" && parts.length >= 2) return `glossary.md#${parts[parts.length - 1]}`;
  return SITE + href;
}
const rewriteLinks = (s) => s.replace(/\[([^\]]*)\]\((\/[^)\s]*)\)/g, (_, t, h) => { const l = mapLink(h); return l ? `[${t}](${l})` : t; });

// ---------- JSX scanning ----------
const KNOWN = new Set(["Playground", "FaqStructuredData", "BuildEffort", "PatternComparison", "RelatedPatternsCard",
  "Card", "Cards", "GuidesBanner", "PatternPreview", "ChecklistDownload", "DecisionFlowSection", "ComparisonGrid",
  "PerformanceComparison", "PatternStats", "PatternGuideList", "Mermaid", "ImplementationMetrics", "ExamplesGrid",
  "ComponentPreviewServer", "Callout", "Steps", "Step", "Tabs", "Tab", "GlossaryStructuredData"]);

function evalExpr(expr, where) {
  try { return new Function(...Object.keys(scope), `return (${expr});`)(...Object.values(scope)); }
  catch (e) { throw new Error(`${where}: cannot evaluate {${expr.slice(0, 80)}…}: ${e.message}`); }
}

function skipString(s, i) { // s[i] is a quote; returns index after the closing quote
  const q = s[i]; i++;
  while (i < s.length && s[i] !== q) { if (s[i] === "\\") i++; i++; }
  return i + 1;
}
function skipBraces(s, i) { // s[i] === "{"; returns index after matching "}"
  let depth = 0;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'" || c === "`") { i = skipString(s, i) - 1; continue; }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i + 1;
  }
  throw new Error("unbalanced braces");
}

function parseTag(s, start, where) { // s[start] === "<"
  const name = /^<([A-Z][A-Za-z]*)/.exec(s.slice(start))[1];
  let i = start + 1 + name.length; const attrs = {};
  for (;;) {
    while (/\s/.test(s[i])) i++;
    if (s.startsWith("/>", i)) return { name, attrs, end: i + 2, selfClosing: true };
    if (s[i] === ">") { i++; break; }
    const m = /^[A-Za-z_][\w-]*/.exec(s.slice(i));
    if (!m) throw new Error(`${where}: bad attribute in <${name}> near "${s.slice(i, i + 30)}"`);
    const key = m[0]; i += key.length;
    if (s[i] !== "=") { attrs[key] = true; continue; }
    i++;
    if (s[i] === '"' || s[i] === "'") { const e = skipString(s, i); attrs[key] = s.slice(i + 1, e - 1); i = e; }
    else if (s[i] === "{") { const e = skipBraces(s, i); attrs[key] = evalExpr(s.slice(i + 1, e - 1), where); i = e; }
    else throw new Error(`${where}: bad value for ${key} in <${name}>`);
  }
  // find matching close tag, counting nested opens of the same name
  let depth = 1, j = i; const open = new RegExp(`<${name}[\\s>/]`, "g"), close = `</${name}>`;
  for (;;) {
    const c = s.indexOf(close, j);
    if (c < 0) throw new Error(`${where}: <${name}> never closed`);
    open.lastIndex = j; let o;
    while ((o = open.exec(s)) && o.index < c) { const t = parseTag(s, o.index, where); if (!t.selfClosing) depth++; open.lastIndex = t.selfClosing ? t.end : o.index + 1; }
    if (--depth === 0) return { name, attrs, children: s.slice(i, c), end: c + close.length, selfClosing: false };
    j = c + close.length;
  }
}

const list = (a) => (Array.isArray(a) ? a.join("; ") : a ?? "");
const clean = (t) => String(t ?? "").replace(/\s+/g, " ").trim();

function renderFlow(title, nodes, edges) {
  const qs = nodes.filter((n) => n.type === "question");
  const step = Object.fromEntries(qs.map((n, k) => [n.id, k + 1]));
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const out = [`### ${title ?? "Decision flow"}`, ""];
  for (const q of qs) {
    out.push(`${step[q.id]}. **${clean(q.data.label)}**${q.data.description ? " " + clean(q.data.description) : ""}`);
    for (const e of edges.filter((e) => e.source === q.id)) {
      const t = byId[e.target];
      const to = t.type !== "question"
        ? `**${clean(t.data.label)}**${t.type === "consideration" ? " (consideration)" : ""}${t.data.description ? ": " + clean(t.data.description) : ""}${t.data.patternLink ? ` (${mapLink(t.data.patternLink)})` : ""}`
        : `go to step ${step[t.id]}`;
      out.push(`   - ${clean(e.label) || "Then"} → ${to}`);
    }
  }
  return out.join("\n");
}

function renderItems(items) { // generic: array of objects → bullets
  const skip = new Set(["icon", "theme", "position", "id", "className", "image", "color"]);
  return (items ?? []).map((it) => {
    const head = it.title ?? it.name ?? it.pattern ?? it.label ?? "";
    const link = it.href ?? it.link ?? it.path;
    const rest = Object.entries(it)
      .filter(([k]) => !skip.has(k) && !["title", "name", "pattern", "label", "href", "link", "path"].includes(k))
      .filter(([, v]) => !(Array.isArray(v) && v.some((x) => x && typeof x === "object")))
      .map(([k, v]) => `${k}: ${typeof v === "object" && !Array.isArray(v) ? JSON.stringify(v) : /url$/i.test(k) && /^\//.test(v) ? SITE + v : list(v)}`);
    const nested = Object.values(it).filter((v) => Array.isArray(v) && v.some((x) => x && typeof x === "object"))
      .flatMap((v) => renderItems(v).split("\n").map((l) => "  " + l));
    return [`- **${clean(head)}**${link ? ` (${mapLink(link)})` : ""}${rest.length ? ". " + rest.join(". ") : ""}`, ...nested].join("\n");
  }).join("\n");
}

// Metric names and definitions live in the React component, scores in the guide data.
function metricInfo(file) {
  const src = fs.readFileSync(path.join(WEB, "components/pattern-comparison", file), "utf8");
  const m = /const metricInfo = (\{[\s\S]*?\n\});/.exec(src);
  if (!m) throw new Error(`${file}: metricInfo not found`);
  return evalExpr(m[1].replace(/^\s*icon:\s*\w+,?\s*$/gm, ""), file);
}
function renderMetrics(name, patterns) {
  const [heading, info] = name === "ImplementationMetrics"
    ? ["Implementation Considerations", metricInfo("implementation-metrics.tsx")]
    : ["Performance Impact", metricInfo("performance-comparison.tsx")];
  const out = [`### ${heading}`, "", ...Object.values(info).map((x) => `- **${x.title}:** ${x.description}`), ""];
  for (const p of patterns ?? []) {
    const scores = Object.keys(info).filter((k) => p[k]).map((k) => `${info[k].title} ${p[k].value}${p[k].status ? ` (${p[k].status})` : ""}${p[k].description ? `: ${clean(p[k].description)}` : ""}`);
    out.push(`- **${clean(p.pattern ?? p.title ?? p.name)}**: ${scores.join("; ")}`);
  }
  return out.join("\n");
}

function renderComponent(t, ctx) {
  const a = t.attrs;
  switch (t.name) {
    case "Playground":
      (ctx.meta.demos ??= []).push(`${a.patternType}/${a.pattern}`);
      return ctx.demoFile ? `> **Live demo:** \`${a.example}\` in \`${ctx.demoFile(a.patternType, a.pattern)}\`` : "";
    case "PatternPreview": case "ChecklistDownload": case "ComponentPreviewServer": case "PatternGuideList":
      return "";
    case "RelatedPatternsCard":
      if (Array.isArray(a.patterns)) return a.patterns.map((x) => `- **${clean(x.title)}**${x.path ? ` (${mapLink(x.path)})` : ""}${x.description ? ": " + clean(x.description) : ""}`).join("\n");
      return ctx.related ? ctx.related(a.category) : "";
    case "GlossaryStructuredData":
      return `**Definition:** ${clean(a.definition)}${a.category ? ` (${clean(a.category)})` : ""}`;
    case "BuildEffort":
      ctx.meta.effort = a.level;
      return `**Build effort:** ${a.level}. ${clean(a.description)}`;
    case "PatternStats":
      return Object.entries(a).map(([k, v]) => `**${k[0].toUpperCase() + k.slice(1)}:** ${v}`).join(" · ");
    case "PatternComparison": {
      ctx.meta.alternatives = a.alternatives ?? [];
      const rows = (a.alternatives ?? []).map((x) => [
        `**${x.name}**${x.path ? ` (${mapLink(x.path)})` : ""}: use it when ${clean(x.when)}.`,
        `  - Pros: ${list(x.pros)}`,
        `  - Cons: ${list(x.cons)}`,
      ].join("\n"));
      const intro = [a.title ? `**${clean(a.title)}.**` : "", a.description ? clean(a.description) : ""].filter(Boolean).join(" ");
      return `### Alternatives to ${a.current ?? "this pattern"}\n\n${intro ? intro + "\n\n" : ""}${rows.map((r) => "- " + r).join("\n")}`;
    }
    case "FaqStructuredData":
      return (a.items ?? []).map((q) => `**Q: ${clean(q.question)}**\n\n${String(q.answer).trim()}`).join("\n\n");
    case "GuidesBanner":
      return `> **Related guide:** ${clean(a.title)}: ${clean(a.description)} (${mapLink(a.guidePath)})`;
    case "Mermaid":
      return "```mermaid\n" + String(a.graph ?? a.chart ?? "").replace(/^\n+|\s+$/g, "") + "\n```";
    case "Callout":
      return convertProse(t.children, ctx).trim().split("\n").map((l) => "> " + l).join("\n");
    case "Cards": case "Steps": case "Tabs":
      return convertProse(t.children, ctx).split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
    case "Card": case "Step": case "Tab": {
      const body = t.children ? clean(convertProse(t.children, ctx)) : clean(a.description);
      const link = a.href ? ` (${mapLink(a.href)})` : "";
      return `- **${clean(a.title ?? a.value ?? "")}**${link}${body ? ": " + body : ""}`;
    }
    case "DecisionFlowSection":
      return renderFlow(a.title, a.nodes, a.edges);
    case "ComparisonGrid":
      return (a.patterns ?? []).map((p) => `- **${clean(p.title)}**${p.href ? ` (${mapLink(p.href)})` : ""}${p.subtitle ? `: ${clean(p.subtitle)}.` : ":"} Best for: ${list(p.criteria)}`).join("\n");
    case "ExamplesGrid":
      return renderItems(a.examples);
    case "ImplementationMetrics": case "PerformanceComparison":
      return renderMetrics(t.name, a.patterns);
    default:
      throw new Error(`${ctx.where}: no renderer for <${t.name}>`);
  }
}

function dedent(t) {
  const ind = Math.min(...t.split("\n").filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)[0].length));
  return t.split("\n").map((l) => l.slice(Math.min(ind, /^[ \t]*/.exec(l)[0].length))).join("\n");
}

function convertProse(s, ctx) {
  s = s.replace(/^import\s[\s\S]*?from\s+["'][^"']+["'];?[ \t]*$/gm, "")
       .replace(/^import\s+["'][^"']+["'];?[ \t]*$/gm, "")
       .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
       .replace(/([.!?a-z])(#{2,4} [A-Z][^\n]*)$/gm, "$1\n\n$2") // "…on mobile.## Anatomy" in three source files
       .replace(/^[ \t]*<div[^>]*>[ \t]*\n([\s\S]*?)\n[ \t]*<\/div>[ \t]*$/gm, (_, inner) => dedent(inner));
  if (/^[ \t]*<\/?div[\s>]/m.test(s)) { // wrappers the regex above could not pair (nested, or opened mid-file)
    s = s.replace(/^[ \t]*<\/?div(?:\s[^>]*)?>[ \t]*$/gm, "");
    s = s.split(/\n{2,}/).map((block) => (/^[ \t]/.test(block) ? dedent(block) : block)).join("\n\n");
  }
  let out = "", i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "`") { // inline code span, copied verbatim
      const run = /^`+/.exec(s.slice(i))[0]; const e = s.indexOf(run, i + run.length);
      const end = e < 0 ? i + run.length : e + run.length; out += s.slice(i, end); i = end; continue;
    }
    const m = c === "<" && /^<([A-Z][A-Za-z]*)/.exec(s.slice(i));
    if (m && KNOWN.has(m[1])) {
      const t = parseTag(s, i, ctx.where);
      out += "\n" + renderComponent(t, ctx) + "\n"; i = t.end; continue; // block-level; blank lines collapse later
    }
    out += c; i++;
  }
  return rewriteLinks(out).replace(/^[ \t]{1,3}(#{1,6} )/gm, "$1") // headings left indented by layout wrappers
    .replace(/([^\n])\n(#{1,6} |\*\*[^*\n]+\*\*[ \t]*$)/gm, "$1\n\n$2"); // so they don't fold into the list above
}

function convert(mdx, ctx) { // keeps fenced code verbatim, converts everything else
  const lines = mdx.split("\n"); const parts = []; let buf = [], fence = null;
  const flush = (code) => { if (buf.length) parts.push({ code, text: buf.join("\n") }); buf = []; };
  for (const line of lines) {
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (!fence && f) { flush(false); fence = f[1]; buf.push(line); continue; }
    if (fence && f && f[1][0] === fence[0] && f[1].length >= fence.length && line.trim() === f[1]) { buf.push(line); flush(true); fence = null; continue; }
    buf.push(line);
  }
  flush(!!fence);
  return parts.map((p) => (p.code ? p.text : convertProse(p.text, ctx))).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

// Frontmatter YAML as the site uses it: scalars, inline arrays, block lists of scalars or of maps.
const yamlValue = (v) => (/^\[.*\]$/.test(v.trim()) ? evalExpr(v.trim(), "frontmatter") : v.trim().replace(/^["']|["']$/g, ""));
function frontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) return { fm: {}, body: raw };
  const fm = {}; let key = null, item = null;
  for (const l of m[1].split("\n")) {
    const kv = /^(\w+):\s*(.*)$/.exec(l);
    if (kv) { key = kv[1]; item = null; fm[key] = kv[2].trim() === "" ? [] : yamlValue(kv[2]); continue; }
    if (!key || !Array.isArray(fm[key])) continue;
    const li = /^\s*-\s+(.*)$/.exec(l);
    if (li) {
      const mk = /^(\w+):\s*(.*)$/.exec(li[1]);
      if (mk) { item = { [mk[1]]: yamlValue(mk[2]) }; fm[key].push(item); } else { item = null; fm[key].push(yamlValue(li[1])); }
      continue;
    }
    const sub = /^\s+(\w+):\s*(.*)$/.exec(l);
    if (sub && item) item[sub[1]] = yamlValue(sub[2]);
  }
  return { fm, body: raw.slice(m[0].length) };
}
const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
// The facts the site shows above a page's content: aliases, best for, avoid when, compare with.
function facts(fm) {
  const out = [];
  const alias = [...asList(fm.aliases), ...asList(fm.synonyms)];
  if (alias.length) out.push(`- **Also called:** ${alias.join(", ")}`);
  if (asList(fm.bestFor).length) out.push(`- **Best for:** ${asList(fm.bestFor).join("; ")}`);
  if (asList(fm.avoidWhen).length) out.push(`- **Avoid when:** ${asList(fm.avoidWhen).join("; ")}`);
  if (asList(fm.compareWith).length) out.push(`- **Compare with:** ${asList(fm.compareWith).map((x) => (typeof x === "string" ? x : `${x.name}${x.href ? ` (${mapLink(x.href)})` : ""}`)).join(", ")}`);
  if (asList(fm.related_patterns).length) out.push(`- **Related patterns:** ${asList(fm.related_patterns).map(mapLink).join(", ")}`);
  if (Array.isArray(fm.category)) out.push(`- **Topics:** ${fm.category.join(", ")}`);
  return out;
}

// Line map on top of each file, so a reader can Read one section by offset instead of the whole file.
// Use Cases and Best Practices also list their ### subsections (alternatives, accessibility, layout...).
const WITH_SUBS = /^(Use Cases|Best Practices)$/;
function withSectionMap(header, body) {
  const bodyLines = body.split("\n"); const heads = []; let fence = null;
  const label = (l) => l.replace(/^#+ /, "").replace(/[*_`]|\s*🚫/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/:$/, "").trim();
  bodyLines.forEach((l, k) => {
    const f = /^\s*(`{3,}|~{3,})/.exec(l);
    if (f) fence = fence ? null : f[1];
    // a ### before the first ## (some guides) is top-level, or the map would skip the start of the file
    else if (!fence && /^#{2,3} /.test(l)) heads.push({ level: l.startsWith("### ") && heads.some((h) => h.real) ? 3 : 2, real: l.startsWith("## "), name: label(l), k });
  });
  const offset = header.split("\n").length + 3; // title, blank line, map line, blank line
  const total = offset + bodyLines.length;
  const endOf = (n) => { const h = heads[n]; const next = heads.slice(n + 1).find((x) => x.level <= h.level); return next ? offset + next.k : total; };
  const tops = heads.map((h, n) => ({ ...h, n })).filter((h) => h.level === 2);
  const map = tops.map((h) => {
    let item = `${h.name} ${offset + h.k + 1}-${endOf(h.n)}`;
    if (WITH_SUBS.test(h.name)) {
      const subs = heads.map((x, n) => ({ ...x, n })).filter((x) => x.level === 3 && x.k > h.k && offset + x.k < endOf(h.n));
      if (subs.length) item += ` (${subs.map((x) => `${x.name} ${offset + x.k + 1}-${endOf(x.n)}`).join(", ")})`;
    }
    return item;
  }).join(" · ");
  return `${header}\n\n**Sections (line range):** ${map}\n\n${body}`;
}

function section(md, re) { // text of the first "## " or "### " section whose title matches re
  const lines = md.split("\n"); const start = lines.findIndex((l) => /^#{2,3} /.test(l) && re.test(l));
  if (start < 0) return "";
  const level = /^#+/.exec(lines[start])[0].length;
  const end = lines.findIndex((l, k) => k > start && new RegExp(`^#{1,${level}} `).test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}
const bullets = (s) => s.split("\n").filter((l) => /^\s*[*-] /.test(l)).map((l) => l.replace(/^\s*[*-] /, ""));
const lead = (b) => clean((/^\*\*(.+?)\*\*/.exec(b)?.[1] ?? b.split(/ [–-] |: /)[0]).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")).replace(/[.:]$/, "");
const linkedSlugs = (b) => [...b.matchAll(/\]\(patterns\/[^/]+\/([^).#]+)\.md/g)].map((m) => m[1]);

// Demo code the site renders under each pattern: apps/web/examples/patterns/<type>/<pattern>/<example>.ts
const exRoot = path.join(WEB, "examples/patterns");
const demoUsed = new Set();
function writeDemos(type, pattern, title) {
  const dir = path.join(exRoot, type, pattern);
  if (!fs.existsSync(dir)) throw new Error(`no demo folder ${type}/${pattern}`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts" && !f.endsWith(".test.ts"))
    .sort((a, b) => (a === "basic.ts" ? -1 : b === "basic.ts" ? 1 : a.localeCompare(b)));
  const parts = [`Code of the live demos on ${SITE}/patterns/${type}/${pattern}. Plain HTML, CSS and JS.`, ""];
  for (const f of files) {
    const defs = Object.values(loadTs(path.join(dir, f))).filter((d) => d && typeof d.html === "string");
    if (!defs.length) throw new Error(`${type}/${pattern}/${f}: no example definition`);
    demoUsed.add(path.join(dir, f));
    for (const d of defs) {
      parts.push(`## ${f.slice(0, -3)}${d.title ? `: ${clean(d.title)}` : ""}`, "");
      if (d.description) parts.push(clean(d.description), "");
      for (const [lang, code] of [["html", d.html], ["css", d.css], ["js", d.js]]) {
        if (!code || !code.trim()) continue;
        const fence = code.includes("```") ? "````" : "```";
        parts.push(fence + lang, code.replace(/^\n+|\s+$/g, ""), fence, "");
      }
    }
  }
  const out = path.join(REF, "patterns", type, `${pattern}.examples.md`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, withSectionMap(`# ${title}: demo code`, parts.join("\n")));
  return files.map((f) => f.slice(0, -3));
}

// ---------- build ----------
const log = { patterns: 0, guides: 0, glossary: 0 };
fs.rmSync(REF, { recursive: true, force: true });
const pRoot = path.join(CONTENT, "patterns");
const catMeta = JSON.parse(fs.readFileSync(path.join(pRoot, "meta.json"), "utf8"));
const categories = fs.readdirSync(pRoot).filter((d) => fs.statSync(path.join(pRoot, d)).isDirectory());
const order = (catMeta.pages ?? []).filter((p) => categories.includes(p));
for (const c of categories) if (!order.includes(c)) order.push(c);

const catalog = {}; // category -> [{slug,title,summary,...}]
for (const cat of order) {
  const meta = JSON.parse(fs.readFileSync(path.join(pRoot, cat, "meta.json"), "utf8"));
  const slugs = fs.readdirSync(path.join(pRoot, cat)).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4));
  const sorted = [...(meta.pages ?? []).filter((s) => slugs.includes(s)), ...slugs.filter((s) => !(meta.pages ?? []).includes(s))];
  catalog[cat] = { title: meta.title ?? cat, description: meta.description ?? "", items: [] };
  for (const slug of sorted) {
    const raw = fs.readFileSync(path.join(pRoot, cat, `${slug}.mdx`), "utf8");
    const { fm, body } = frontmatter(raw);
    const ctx = { where: `${cat}/${slug}`, meta: {}, demoFile: (t, p) => `patterns/${t}/${p}.examples.md`, related: (c = cat) => fs.readdirSync(path.join(pRoot, c)).filter((f) => f.endsWith(".mdx") && f !== `${slug}.mdx`).map((f) => `- patterns/${c}/${f.slice(0, -4)}.md`).join("\n") };
    const md = convert(body, ctx);
    const demos = [...new Set(ctx.meta.demos ?? [])].map((d) => { const [t, p] = d.split("/"); return [d, writeDemos(t, p, fm.title ?? slug)]; });
    const meta = [`**Category:** ${catalog[cat].title}`, fm.status && `**Status:** ${fm.status}`, fm.popularity && `**Popularity:** ${fm.popularity}`,
      fm.complexity && `**Complexity:** ${fm.complexity}`, fm.accessibilityRisk && `**Accessibility risk:** ${fm.accessibilityRisk}`,
      ctx.meta.effort && `**Build effort:** ${ctx.meta.effort}`, `**Source:** ${SITE}/patterns/${cat}/${slug}`].filter(Boolean).join(" · ");
    const top = [`> ${fm.summary ?? ""}`, "", ...(fm.description ? [clean(fm.description), ""] : []), meta, "",
      ...facts(fm), ...demos.map(([d, names]) => `- **Demo code:** \`patterns/${d}.examples.md\` (${names.join(", ")})`), "", ""].join("\n");
    const out = path.join(REF, "patterns", cat, `${slug}.md`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, withSectionMap(`# ${fm.title ?? slug}`, top.replace(/\n{3,}/g, "\n\n") + md));
    const uses = section(md, /When to use/i), nots = section(md, /When not to use/i);
    catalog[cat].items.push({
      slug, title: fm.title ?? slug, summary: fm.summary ?? "", effort: ctx.meta.effort, popularity: fm.popularity,
      aliases: [...new Set([...asList(fm.aliases), ...(ALIASES[slug] ? ALIASES[slug].split(", ") : [])])],
      bestFor: asList(fm.bestFor), avoidWhen: asList(fm.avoidWhen),
      useFor: bullets(uses).map(lead).filter(Boolean),
      notFor: bullets(nots).map((b) => { const s = linkedSlugs(b); return `${lead(b)}${s.length ? " → " + s.join(", ") : ""}`; }),
      alternatives: (ctx.meta.alternatives ?? []).map((x) => `${x.name}${x.path ? ` (${mapLink(x.path).replace(/^patterns\//, "").replace(/\.md$/, "")})` : ""}: when ${clean(x.when)}`),
    });
    log.patterns++;
  }
}

// chooser index, one file per category
fs.mkdirSync(path.join(REF, "index"), { recursive: true });
for (const [cat, c] of Object.entries(catalog)) {
  const lines = [`${c.description}. Full pattern files: \`patterns/${cat}/<slug>.md\`.`, ""];
  const starts = [];
  for (const it of c.items) {
    starts.push([it.slug, lines.length]);
    lines.push(`## ${it.slug}: ${it.title}`, "", `${it.summary.replace(/\.$/, "")}.${it.effort ? ` Build effort ${it.effort}.` : ""}${it.popularity ? ` Popularity ${it.popularity}.` : ""}`);
    if (it.aliases.length) lines.push(`- **Also called:** ${it.aliases.join(", ")}`);
    if (it.bestFor.length) lines.push(`- **Best for:** ${it.bestFor.join("; ")}`);
    if (it.avoidWhen.length) lines.push(`- **Avoid when:** ${it.avoidWhen.join("; ")}`);
    if (it.useFor.length) lines.push(`- **Use for:** ${it.useFor.join("; ")}`);
    if (it.notFor.length) lines.push(`- **Not for:** ${it.notFor.join("; ")}`);
    if (it.alternatives.length) lines.push(`- **Alternatives:** ${it.alternatives.join(" | ")}`);
    lines.push("");
  }
  const head = 4; // title, blank, map, blank
  const map = starts.map(([slug, k], n) => `${slug} ${head + k + 1}-${n + 1 < starts.length ? head + starts[n + 1][1] : head + lines.length}`).join(" · ");
  fs.writeFileSync(path.join(REF, "index", `${cat}.md`), [`# ${c.title}: which pattern for which job`, "", `**Patterns (line range):** ${map}`, "", ...lines].join("\n"));
}

// guides
fs.mkdirSync(path.join(REF, "guides"), { recursive: true });
const guideSrc = [
  ...fs.readdirSync(path.join(CONTENT, "pattern-guide")).filter((f) => f.endsWith(".mdx") && f !== "index.mdx").map((f) => path.join(CONTENT, "pattern-guide", f)),
  ...["when-to-use-what", "getting-started", "books"].map((s) => path.join(pRoot, `${s}.mdx`)),
];
const guides = [];
for (const file of guideSrc) {
  const slug = path.basename(file, ".mdx");
  const { fm, body } = frontmatter(fs.readFileSync(file, "utf8"));
  const md = convert(body, { where: `guide/${slug}`, meta: {} });
  fs.writeFileSync(path.join(REF, "guides", `${slug}.md`), withSectionMap(`# ${fm.title ?? slug}`, [...(fm.summary ? [`> ${fm.summary}`, ""] : []), fm.summary ? clean(fm.description ?? "") : `> ${fm.description ?? ""}`, "", ...facts(fm), "", md].join("\n").replace(/\n{3,}/g, "\n\n")));
  guides.push({ slug, title: fm.title ?? slug });
  log.guides++;
}

// glossary, one file
const gRoot = path.join(CONTENT, "glossary"); const terms = [];
for (const letter of fs.readdirSync(gRoot).filter((d) => fs.statSync(path.join(gRoot, d)).isDirectory()).sort()) {
  for (const f of fs.readdirSync(path.join(gRoot, letter)).filter((f) => f.endsWith(".mdx")).sort()) {
    const slug = f.slice(0, -4); const { fm, body } = frontmatter(fs.readFileSync(path.join(gRoot, letter, f), "utf8"));
    terms.push(`## ${fm.title ?? slug} (${slug})\n\n${fm.description ? clean(fm.description) + "\n\n" : ""}${facts(fm).join("\n")}${facts(fm).length ? "\n\n" : ""}${convert(body, { where: `glossary/${slug}`, meta: {} }).replace(/^## /gm, "### ")}`);
    log.glossary++;
  }
}
fs.writeFileSync(path.join(REF, "glossary.md"), `# Glossary\n\nAnchors are the slug in brackets.\n\n${terms.join("\n")}`);

// master index in SKILL.md, between markers
const idx = [];
for (const [cat, c] of Object.entries(catalog)) {
  idx.push(`**${c.title}** (\`index/${cat}.md\`): ${c.items.map((it) => `\`${it.slug}\`${it.aliases.length ? ` [${it.aliases.join(", ")}]` : ""} ${it.summary.toLowerCase().replace(/\.$/, "")}`).join(" · ")}`, "");
}
idx.push(`**Guides** (\`guides/<slug>.md\`): ${guides.map((g) => `\`${g.slug}\``).join(" · ")}`);
const skillFile = path.join(SKILL, "SKILL.md");
const skill = fs.readFileSync(skillFile, "utf8");
const [b, e] = ["<!-- PATTERN INDEX START -->", "<!-- PATTERN INDEX END -->"];
if (!skill.includes(b) || !skill.includes(e)) throw new Error("SKILL.md lacks the PATTERN INDEX markers");
fs.writeFileSync(skillFile, skill.slice(0, skill.indexOf(b) + b.length) + "\n" + idx.join("\n") + "\n" + skill.slice(skill.indexOf(e)));

// Anchors: keep one only if the target file has a heading with that slug.
const slugify = (h) => h.toLowerCase().replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
const anchorsOf = new Map();
const headingSlugs = (f) => { if (!anchorsOf.has(f)) anchorsOf.set(f, new Set(fs.readFileSync(f, "utf8").split("\n").filter((l) => /^#{1,6} /.test(l)).map((l) => slugify(l.replace(/^#+ /, "").replace(/ \(([\w-]+)\)$/, " $1"))).concat(fs.readFileSync(f, "utf8").match(/^## .* \(([\w-]+)\)$/gm)?.map((l) => /\(([\w-]+)\)$/.exec(l)[1]) ?? []))); return anchorsOf.get(f); };
let anchorsDropped = 0;
for (const f of (function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)])); })(REF).filter((f) => f.endsWith(".md"))) {
  const t = fs.readFileSync(f, "utf8");
  const u = t.replace(/\(((?:patterns|guides|index)\/[^)#\s]+\.md|glossary\.md)#([^)\s]+)\)/g, (all, file, anchor) => {
    const target = path.join(REF, file);
    if (fs.existsSync(target) && headingSlugs(target).has(anchor)) return all;
    anchorsDropped++; return `(${file})`;
  });
  if (u !== t) fs.writeFileSync(f, u);
}

// ---------- self-check ----------
const problems = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]));
const all = walk(REF).filter((f) => f.endsWith(".md"));
const expected = categories.flatMap((c) => fs.readdirSync(path.join(pRoot, c)).filter((f) => f.endsWith(".mdx"))).length;
if (log.patterns !== expected) problems.push(`patterns written ${log.patterns}, source has ${expected}`);
for (const f of all) {
  const text = fs.readFileSync(f, "utf8");
  const prose = text.replace(/^\s*(`{3,}|~{3,})[\s\S]*?^\s*\1\s*$/gm, "").replace(/`[^`\n]*`/g, "");
  let inList = false;
  for (const l of prose.split("\n")) {
    if (/^\s*([-*+]|\d+\.) /.test(l)) inList = true; else if (!l.trim()) {} else if (!/^\s/.test(l)) inList = false;
    if (!inList && /^ {4,}\S/.test(l) && !/^\s*</.test(l)) { problems.push(`${path.relative(REF, f)}: indented prose renders as code: "${l.trim().slice(0, 50)}"`); break; }
  }
  for (const m of prose.matchAll(/<([A-Z][A-Za-z]+)[\s/>]/g)) problems.push(`${path.relative(REF, f)}: leftover <${m[1]}>`);
  if (/\[object Object\]|undefined\b(?=[.:;,])/.test(prose)) problems.push(`${path.relative(REF, f)}: unrendered data ([object Object] or undefined)`);
  if (/^[ \t]*<\/?div[\s>]/m.test(prose)) problems.push(`${path.relative(REF, f)}: leftover layout <div>`);
  for (const m of prose.matchAll(/\]\(((?:patterns|guides|index)\/[^)#\s]+)(#[^)]*)?\)/g)) {
    if (!fs.existsSync(path.join(REF, m[1]))) problems.push(`${path.relative(REF, f)}: dangling link ${m[1]}`);
  }
}
for (const m of fs.readFileSync(skillFile, "utf8").matchAll(/`index\/([\w-]+)\.md`/g)) {
  if (!fs.existsSync(path.join(REF, "index", `${m[1]}.md`))) problems.push(`SKILL.md: dangling index/${m[1]}.md`);
}
// Coverage: every six-word run of source prose and prop text must appear in its output file.
// Only the deliberately dropped components (live demos, previews, download buttons) are exempt.
const norm = (t) => t.replace(/<\/?div(?:[ \t][^>\n]*)?>/g, " ").replace(/<\/?[A-Z][A-Za-z]*|\/?>/g, " ").replace(/\\n/g, " ").replace(/"\s*\+\s*"/g, "").replace(/\]\([^)]*\)/g, "]").replace(/\b[a-zA-Z]+=/g, " ")
  .replace(/[^\w\s<>/.%+-]/g, " ").replace(/\s+/g, " ").toLowerCase();
const shingles = (src) => {
  src = src.replace(/^---\n([\s\S]*?)\n---/, (_, y) => y.replace(/^[ \t]*-?[ \t]*(\w+:[ \t]*)?/gm, "")) // frontmatter values, not keys
    .replace(/^\s*(html|css|js|title|description|height):\s*/gm, "").replace(/^export const .*$/gm, "") // demo definition keys
    .replace(/^import .*$/gm, "").replace(/"\s*\+\s*\n\s*"/g, "")
    .replace(/\b(?:href|path|guidePath|patternLink)=["']\/(?:patterns|pattern-guide|glossary)[^"']*["']/g, " ") // rewritten internal links
    .replace(/\b\w+=\{[\w.]+\}/g, " ") // props that only name a variable
    .replace(/<(Playground|PatternPreview|ComponentPreviewServer|ChecklistDownload|PatternGuideList)[\s\S]*?\/>/g, "");
  return src.split(/\n|(?<=[.!?:;])\s+/).flatMap((line) => { const w = norm(line).split(" ").filter(Boolean); const o = []; for (let i = 0; i + 6 <= w.length; i += 6) o.push(w.slice(i, i + 6).join(" ")); return o; });
};
const coverage = [
  ...categories.flatMap((c) => fs.readdirSync(path.join(pRoot, c)).filter((f) => f.endsWith(".mdx")).map((f) => [path.join(pRoot, c, f), path.join(REF, "patterns", c, f.replace(/x$/, ""))])),
  ...guideSrc.map((g) => [g, path.join(REF, "guides", path.basename(g).replace(/x$/, ""))]),
  ...[...demoUsed].map((f) => [f, path.join(REF, "patterns", path.basename(path.dirname(path.dirname(f))), `${path.basename(path.dirname(f))}.examples.md`)]),
  ...fs.readdirSync(gRoot).filter((d) => fs.statSync(path.join(gRoot, d)).isDirectory()).flatMap((d) => fs.readdirSync(path.join(gRoot, d)).filter((f) => f.endsWith(".mdx")).map((f) => [path.join(gRoot, d, f), path.join(REF, "glossary.md")])),
];
let shTotal = 0; const shMissing = [];
for (const [s, o] of coverage) {
  const out = norm(fs.readFileSync(o, "utf8"));
  for (const sh of shingles(fs.readFileSync(s, "utf8"))) { shTotal++; if (!out.includes(sh)) shMissing.push(`${path.relative(CONTENT, s)}: "${sh}"`); }
}
for (const t of fs.readdirSync(exRoot).filter((d) => fs.statSync(path.join(exRoot, d)).isDirectory()))
  for (const p of fs.readdirSync(path.join(exRoot, t)).filter((d) => fs.statSync(path.join(exRoot, t, d)).isDirectory()))
    for (const f of fs.readdirSync(path.join(exRoot, t, p)).filter((f) => f.endsWith(".ts") && f !== "index.ts" && !f.endsWith(".test.ts")))
      if (!demoUsed.has(path.join(exRoot, t, p, f))) problems.push(`demo not included: ${t}/${p}/${f}`);
if (shMissing.length) problems.push(...shMissing.map((m) => `text lost: ${m}`));
const slugs = new Set(Object.values(catalog).flatMap((c) => c.items.map((it) => it.slug)));
for (const k of Object.keys(ALIASES)) if (!slugs.has(k)) problems.push(`ALIASES: ${k} is not a pattern slug`);
for (const f of all) {
  const L = fs.readFileSync(f, "utf8").split("\n"); const m = L.slice(0, 4).find((l) => /^\*\*(Sections|Patterns) \(line range\):\*\*/.test(l));
  if (!m) continue;
  for (const [, name, a] of m.split(":**")[1].matchAll(/([^·(),]+?) (\d+)-\d+/g)) {
    if (!/^#{2,3} /.test(L[a - 1] ?? "") || !L[a - 1].includes(name.trim().split(" ")[0])) problems.push(`${path.relative(REF, f)}: map entry "${name.trim()}" points at line ${a}`);
  }
}
const commit = execFileSync("git", ["-C", SRC, "log", "-1", "--format=%h %ad", "--date=short"]).toString().trim();
console.log(JSON.stringify({ ...log, anchorsDropped, textRunsChecked: shTotal, textRunsLost: shMissing.length, categories: Object.keys(catalog).length, files: all.length, source: commit, problems: problems.length }));
if (problems.length) { console.error(problems.slice(0, 40).join("\n")); process.exit(1); }
