"""Install the SDLC chain into the current repo from sdlc.json.

    python3 adopt.py [--dry-run] [--preset node|python] [--ticket KEY-123]
    python3 adopt.py --templates-hash        # what sdlc.json `kitTemplates` should say

Idempotent: generated files (hooks, workflows, verify scripts, docs, test) are rewritten
from the templates every run; files the repo owns (sdlc.json, REVIEW.md, settings.json
content outside the SDLC hooks, CLAUDE.md, the "Repo-specific" tail of docs/sdlc.md,
anything listed in sdlc.json `keep`) are created once and then kept. Migrates a `goals/`
tree and `.claude/plans/` when it finds them, and removes what the retired merge tiers
left behind. Adds a missing
`verifyStop` from the preset and rewrites a whole-suite E2E `--repeat-each` in
`checks.milestone` to the preset's form, listing the open changes that must be re-approved.
stdlib only.

Output ends with three sections: WROTE, KEPT, MANUAL -- the skill relays MANUAL to the user.

v3 keys are pass-through repo policy. `verifyStop`, `planGate`, `testGlobs`, `prototypeDirs`,
`feedback`, `milestones`, `hotfix`, `checks`, `goal`, `languages`, `responsiveTier`, `ux` and
`protected` are read when present. Existing repos keep their values, and adopt does not add
missing optional keys unless the selected preset already contains them.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
TPL = SKILL / "templates"
ROOT = Path.cwd()
if "--help" in sys.argv or "-h" in sys.argv:
    print(__doc__)
    sys.exit(0)


def templates_hash() -> str:
    """Fingerprint of everything `adopt` copies into a repo. `sdlc.json` records it, so
    `status.sh` can tell a repo whose copies predate the installed kit -- the copies run in
    CI, where no plugin is installed, so they cannot read the skill at runtime."""
    h = hashlib.sha256()
    # Bytecode is not a template: adopt imports design_index.py from TPL, and the
    # __pycache__ it may leave would otherwise mark every repo stale on that laptop.
    for f in sorted(p for p in TPL.rglob("*") if p.is_file() and "__pycache__" not in p.parts):
        h.update(str(f.relative_to(TPL)).encode())
        h.update(f.read_bytes())
    return h.hexdigest()[:12]


if "--templates-hash" in sys.argv:
    print(templates_hash())
    sys.exit(0)
DRY = "--dry-run" in sys.argv
wrote: list[str] = []
written: list[Path] = []
kept: list[str] = []
manual: list[str] = []

# --- sdlc.json ---------------------------------------------------------------------------


def detect_preset() -> str:
    if "--preset" in sys.argv:
        return sys.argv[sys.argv.index("--preset") + 1]
    if (ROOT / "package.json").exists():
        return "node"
    if (ROOT / "pyproject.toml").exists():
        return "python"
    sys.exit(
        "cannot detect a preset (no package.json, no pyproject.toml); pass --preset node|python"
    )


def default_branch() -> str:
    # origin/HEAD exists only after `git clone`; a repo pushed with `gh repo create --push` or
    # `git remote add` lacks it, so ask the remote before falling back.
    for cmd in (
        ["git", "symbolic-ref", "refs/remotes/origin/HEAD"],
        ["git", "ls-remote", "--symref", "origin", "HEAD"],
    ):
        out = subprocess.run(cmd, capture_output=True, text=True).stdout
        m = re.search(r"refs/(?:remotes/origin|heads)/(\S+)", out)
        if m:
            return m.group(1)
    return "master"


def git_email() -> str:
    try:
        return subprocess.run(
            ["git", "config", "user.email"], capture_output=True, text=True
        ).stdout.strip()
    except OSError:
        return ""


# --- change folder ids --------------------------------------------------------------------

# `<created>-<KEY>-<slug>`, and `<created>-<slug>` when the change has no Linear issue.
CHANGE_DIR = re.compile(r"^(\d{4}-\d{2}-\d{2})-(?:([A-Z][A-Z0-9]+-\d+)-)?([a-z0-9][a-z0-9-]*)$")
# Everything the chain named before the date prefix existed, `PENDING-` included.
LEGACY_DIR = re.compile(r"^(?:(\d{4}-\d{2}-\d{2})-)?(?:([A-Z][A-Z0-9]+-\d+|PENDING)-)?(.+)$")


def change_id(date: str, key: str, slug: str) -> str:
    return f"{date}-{key}-{slug}" if key else f"{date}-{slug}"


def first_commit_date(path: Path) -> str:
    out = subprocess.run(
        ["git", "log", "--diff-filter=A", "--format=%ad", "--date=short", "--", str(path)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    ).stdout.split()
    return out[-1] if out else ""


def migrate_change_ids(changes: Path, today: str) -> None:
    """Rename folders from before the date prefix, and drop `PENDING` -- it never meant
    "a key is coming", it meant "this change has no Linear issue"."""
    folders = [p for p in sorted(changes.glob("*")) if p.is_dir() and p.name != "archive"]
    folders += archived_changes(changes / "archive")
    for old in folders:
        if CHANGE_DIR.match(old.name):
            continue
        m = LEGACY_DIR.match(old.name)
        if not m:
            continue
        date, key, slug = m.group(1) or "", m.group(2) or "", m.group(3)
        key = "" if key == "PENDING" else key
        arts = [old / n for n in ("plan.md", "facts.md", "intent.md") if (old / n).exists()]
        if not date:
            for a in arts:
                fm = re.search(
                    r"^created:\s*(\d{4}-\d{2}-\d{2})", a.read_text(encoding="utf-8"), re.M
                )
                if fm:
                    date = fm.group(1)
                    break
        date = date or first_commit_date(old) or today
        new = old.with_name(change_id(date, key, slug))
        if new == old:
            continue
        wrote.append(
            f"{old.relative_to(ROOT)} -> {new.relative_to(ROOT)} (renamed: ids carry their creation date)"
        )
        if DRY:
            continue
        subprocess.run(["git", "mv", str(old), str(new)], cwd=ROOT, check=True)
        for md in sorted(new.glob("*.md")):
            text = md.read_text(encoding="utf-8")
            head, sep, body = (
                text[4:].partition("\n---\n") if text.startswith("---\n") else ("", "", "")
            )
            if not sep:
                continue
            head = re.sub(r"^change:.*$", f"change: {new.name}", head, count=1, flags=re.M)
            head = re.sub(r"^linear:.*$", f"linear: {key or 'none'}", head, count=1, flags=re.M)
            if re.search(r"^created:", head, re.M):
                head = re.sub(r"^created:.*$", f"created: {date}", head, count=1, flags=re.M)
            else:
                head += f"\ncreated: {date}"
            md.write_text("---\n" + head + sep + body, encoding="utf-8")


# `2026` and `2026-09`, the two bucket levels -- and NOT `2026-09-04-slug`, which is a
# change. Detecting the bucket rather than the change is what lets this run beside
# migrate_change_ids, whose whole job is folders that do NOT match CHANGE_DIR yet: with the
# other rule it renamed the fresh `2026` bucket to `2026-09-20-2026` on the second adopt.
ARCHIVE_BUCKET = re.compile(r"^\d{4}(-\d{2})?$")


def archived_changes(archive: Path, depth: int = 2) -> list[Path]:
    """Every change folder under the archive, flat or nested, legacy names included."""
    if not archive.is_dir():
        return []
    out: list[Path] = []
    for child in sorted(archive.iterdir()):
        if not child.is_dir():
            continue
        if depth > 0 and ARCHIVE_BUCKET.match(child.name):
            out.extend(archived_changes(child, depth - 1))
        else:
            out.append(child)
    return out


def migrate_archive_layout(changes: Path) -> None:
    """Nest the archive by <year>/<year-month>/, the way docsDesigns already nests, and make
    every archived folder's name-date its `created` date.

    Two problems, one pass, because both are answered by the same frontmatter. Measured in
    omr-leadhub on 2026-09-20: 52 archived changes in 15 days -- ~1,200 a year in one flat
    directory -- and 2 of them named by their archive date rather than their creation date,
    so a folder name could not be read without opening it.

    Only the archive moves. Open changes stay flat: they are the working set, and hiding
    them behind two directory levels to match a convention costs more than it buys."""
    archive = changes / "archive"
    for old in archived_changes(archive):
        name = old.name
        date = name[:10]
        created = ""
        for art in ("plan.md", "facts.md", "intent.md"):
            f = old / art
            if not f.exists():
                continue
            m = re.search(r"^created:\s*(\d{4}-\d{2}-\d{2})", f.read_text(encoding="utf-8"), re.M)
            if m:
                created = m.group(1)
                break
        # No `created` to trust: leave the name alone and bucket it where it already says.
        if created and created != date:
            name = created + name[10:]
            date = created
        bucket = archive / date[:4] / date[:7]
        new = bucket / name
        if new == old:
            continue
        if new.exists():
            wrote.append(
                f"{old.relative_to(ROOT)} (SKIPPED: {new.relative_to(ROOT)} already exists)"
            )
            continue
        why = "nested by year-month" if name == old.name else "renamed to its creation date, nested"
        wrote.append(f"{old.relative_to(ROOT)} -> {new.relative_to(ROOT)} ({why})")
        if DRY:
            continue
        bucket.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "mv", str(old), str(new)], cwd=ROOT, check=True)
        if name != old.name:
            for md in sorted(new.glob("*.md")):
                text = md.read_text(encoding="utf-8")
                md.write_text(
                    re.sub(r"^change:.*$", f"change: {name}", text, count=1, flags=re.M),
                    encoding="utf-8",
                )
    # git leaves the emptied year/month and flat parents behind; they are not ours to keep.
    for d in sorted(archive.rglob("*"), key=lambda p: -len(p.parts)):
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()


DECISION_LOG = Path("docs/ux/decisions.md")
LOG_FRONTMATTER = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
LOG_DATED = re.compile(r"^(\d{4}-\d{2}-\d{2})\s+(.+)$")
LOG_ROW = re.compile(r"^\|\s*(\d{4}-\d{2}-\d{2})\s*\|(.+)\|\s*$")
LOG_REPLACED = re.compile(
    r"(?:Replaced|Superseded)(?P<p1> in part)?(?: on \d{4}-\d{2}-\d{2})?(?P<p2> in part| for \w+)?"
    r" by (?P<refs>[^\n]+?)(?::|\*\*|$)",
    re.MULTILINE,
)
LOG_REF = re.compile(r"(\d{4}-\d{2}-\d{2}) (.+?)(?= and \d{4}-\d{2}-\d{2} |$)")


def _words(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def split_decision_log(text: str, today: str) -> list[dict[str, object]]:
    """The decisions in an appended log, in order. A `## <date> <title>` section is one
    decision, or one per `### ` child when it has children (a round of answers). Rows of a
    dated table before the first `##` are one decision each; prose after that table is kept
    as notes on every row. An undated `##` takes the date of the section before it."""
    body = LOG_FRONTMATTER.sub("", text, count=1)
    blocks = re.split(r"^## ", body, flags=re.MULTILINE)
    units: list[dict[str, object]] = []
    lines = blocks[0].splitlines()
    rows = [(i, m) for i, line in enumerate(lines) if (m := LOG_ROW.match(line))]
    if rows:
        first = rows[0][0]
        header = [line for line in lines[max(0, first - 2) : first] if line.startswith("|")]
        notes = "\n".join(lines[rows[-1][0] + 1 :]).strip()
        for i, m in rows:
            title = re.split(r"[:;(]", m.group(2).split("|")[0])[0].strip()[:90]
            units.append(
                {
                    "date": m.group(1),
                    "title": title,
                    "body": "\n".join([*header, lines[i]]),
                    "notes": notes,
                }
            )
    last = str(units[0]["date"]) if units else today
    for block in blocks[1:]:
        head, _, rest = block.partition("\n")
        dated = LOG_DATED.match(head.strip())
        date, title = (dated.group(1), dated.group(2).strip()) if dated else (last, head.strip())
        last = date
        parts = re.split(r"^### ", rest, flags=re.MULTILINE)
        if len(parts) == 1:
            units.append({"date": date, "title": title, "body": rest.strip()})
            continue
        for child in parts[1:]:
            child_title, _, child_body = child.partition("\n")
            units.append(
                {
                    "date": date,
                    "title": child_title.strip(),
                    "body": child_body.strip(),
                    "round": title,
                    "lead": parts[0].strip(),
                }
            )
    for u in units:
        said = f"{u['title']} {u.get('round', '')}".lower()
        status = re.search(r"\*\*Status:\*\*\s*([A-Za-z-]+)", str(u["body"]))
        u["status"] = (
            "open"
            if re.search(r"\bopen\b", said)
            else status.group(1).lower()
            if status
            else "accepted"
        )
        u["by"] = "claude" if "settled by claude" in said else "owner" if "owner" in said else ""
        for key in ("supersedes", "superseded_by", "amended_by"):
            u[key] = []
    return units


def link_decisions(units: list[dict[str, object]]) -> list[str]:
    """Turn "Replaced on <date> by <date> <title>" into `superseded_by` on the old decision and
    `supersedes` on the new one; "in part" or "for <who>" is `amended_by` and keeps the old one
    current. Returns every reference that names no decision in the log, for a person to link."""
    unresolved = []
    for old in units:
        body = str(old["body"])
        # Only a note that opens the decision replaces all of it. The same words inside a
        # bullet of a long round replace that bullet, and the rest of the round still holds.
        opening = len(body.lstrip().partition("\n")[0]) + len(body) - len(body.lstrip())
        for m in LOG_REPLACED.finditer(body):
            partial = bool(m.group("p1") or m.group("p2")) or m.start() > opening
            refs = LOG_REF.findall(m.group("refs").strip())
            if not refs:
                unresolved.append(f"{old['id']}: {m.group(0).strip()[:120]}")
            for date, ref in refs:
                want = " ".join(_words(ref))
                new = next(
                    (
                        u
                        for u in units
                        if u["date"] == date
                        and u is not old
                        and (
                            want.startswith(" ".join(_words(str(u["title"]))))
                            or " ".join(_words(str(u["title"]))).startswith(want)
                        )
                    ),
                    None,
                )
                if new is None:
                    unresolved.append(f"{old['id']}: {date} {ref[:100]}")
                    continue
                old["amended_by" if partial else "superseded_by"].append(new["id"])  # type: ignore[union-attr]
                new["supersedes"].append(old["id"])  # type: ignore[union-attr]
                if not partial:
                    old["status"] = "superseded"
        if re.search(r"Replaced|Superseded", str(old.get("notes", ""))):
            unresolved.append(f"{old['id']}: its shared notes say something was replaced")
    return unresolved


def migrate_decision_log(designs: Path, today: str) -> None:
    """Split an appended decision log into one ADR file per decision under `designsDir`.

    `cct:ux-decision` used to append every answer to `docs/ux/decisions.md`. Measured in
    omr-leadhub on 2026-10-20: 2,910 lines, 87 sections, 35 commits in 19 days, read whole by
    every agent that needed one answer. One decision per file plus `INDEX.md` lets it read
    the index and open one file. Idempotent: the log is replaced by a pointer with no
    sections, so a second run finds nothing to split."""
    log = ROOT / DECISION_LOG
    if not log.exists():
        return
    text = log.read_text(encoding="utf-8")
    units = split_decision_log(text, today)
    if not units:
        return
    nested = designs.is_dir() and any(
        p.is_dir() and re.fullmatch(r"\d{4}", p.name) for p in designs.iterdir()
    )
    taken = {p.stem for p in designs.rglob("*.md")} if designs.is_dir() else set()
    for u in units:
        date = str(u["date"])
        base = f"{date}-adr-{'-'.join(_words(str(u['title']))[:6]) or 'decision'}"
        uid, n = base, 2
        while uid in taken:
            uid, n = f"{base}-{n}", n + 1
        taken.add(uid)
        u["id"] = uid
        u["path"] = designs / (f"{date[:4]}/{date[:7]}" if nested else "") / f"{uid}.md"
    unresolved = link_decisions(units)
    source = DECISION_LOG.as_posix()
    for u in units:

        def ids(key: str, u: dict[str, object] = u) -> str:
            return "[" + ", ".join(u[key]) + "]"  # type: ignore[arg-type]

        head = [
            "---",
            f"id: {u['id']}",
            f"title: {json.dumps(str(u['title']), ensure_ascii=False)}",
            "type: adr",
            f"status: {u['status']}",
            f"created: {u['date']}",
            *([f"decided_by: {u['by']}"] if u["by"] else []),
            *(
                [f"round: {json.dumps(str(u['round']), ensure_ascii=False)}"]
                if "round" in u
                else []
            ),
            f"supersedes: {ids('supersedes')}",
            f"superseded_by: {ids('superseded_by')}",
            f"amended_by: {ids('amended_by')}",
            "tags: [ux]",
            f"migrated_from: {source}",
            "---",
            "",
            f"# {u['title']}",
            "",
        ]
        parts = [str(u["body"])]
        if u.get("lead"):
            parts.insert(0, f"## The round: {u['round']}\n\n{u['lead']}\n\n## This decision")
        if u.get("notes"):
            parts.append(f"## Notes on the whole table\n\n{u['notes']}")
        write(Path(str(u["path"])), "\n".join(head) + "\n" + "\n\n".join(parts).rstrip() + "\n")
    title = re.search(r"^# (.+)$", text, re.MULTILINE)
    rel = designs.relative_to(ROOT).as_posix()
    write(
        log,
        f"# {title.group(1).strip() if title else 'Decision log'} (moved)\n\n"
        f"Moved on {today}: every decision is its own file under `{rel}/` (type `adr`), "
        f"listed in `{rel}/INDEX.md`. Write a new decision as a new file, never here.\n"
        f"`git log --follow {source}` holds the old log.\n",
    )
    wrote.append(f"{source}: split into {len(units)} decision files under {rel}/")
    manual.extend(f"link by hand: {line}" for line in unresolved)


def write_design_index(designs: Path) -> None:
    """`INDEX.md` from the kit's own copy of the script, so adopt and CI render the same text."""
    if not designs.is_dir():
        return
    spec = importlib.util.spec_from_file_location(
        "design_index", TPL / "scripts" / "design_index.py"
    )
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    write(designs / "INDEX.md", mod.render(designs))


def write(path: Path, text: str, *, keep: bool = False, executable: bool = False) -> None:
    rel = str(path.relative_to(ROOT))
    if keep and path.exists():
        kept.append(rel)
        return
    if path.exists() and path.read_text(encoding="utf-8") == text:
        kept.append(rel)
        return
    wrote.append(rel)
    if DRY:
        return
    written.append(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    if executable:
        path.chmod(0o755)


def remove(path: Path, why: str) -> None:
    """Take a generated file out of the repo: `git rm`, then unlink whatever git did not track."""
    if not path.exists():
        return
    wrote.append(f"{path.relative_to(ROOT)} (removed: {why})")
    if DRY:
        return
    subprocess.run(["git", "rm", "-qf", "--ignore-unmatch", str(path)], cwd=ROOT, check=True)
    if path.exists():
        path.unlink()


PRETTIER_SUFFIXES = {".ts", ".js", ".mjs", ".json", ".yml", ".yaml", ".md"}


def format_written() -> None:
    """Run the repo's own prettier over what we just wrote.

    The templates cannot be formatted to suit every repo -- printWidth, quotes and plugins
    all differ -- so a repo with a `prettier --check` gate rejects a freshly adopted file.
    The repo's formatter is the authority; we just call it. No prettier, nothing to do."""
    if DRY:
        return
    targets = [p for p in written if p.suffix in PRETTIER_SUFFIXES]
    written.clear()
    binary = ROOT / "node_modules" / ".bin" / "prettier"
    if not targets or not binary.exists():
        return
    out = subprocess.run(
        [str(binary), "--write", "--log-level", "warn", *(str(p) for p in targets)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if out.returncode == 0:
        wrote.append(f"prettier --write on {len(targets)} written file(s)")
    else:
        detail = (out.stderr or out.stdout).strip().splitlines()
        manual.append(
            "prettier failed on the files adopt wrote -- run `prettier --write` before committing"
            + (f": {detail[-1]}" if detail else "")
        )


# CLAUDE-section.md's merge sentence, and the two it replaced when the merge tiers were
# retired (2026-10-31). Single lines on purpose: the swap matches the rendered text byte for
# byte, and a wrapped sentence silently stops matching.
MERGE_SENTENCE = (
    "That PR runs the milestone checks and merges under the repo's own branch protection: "
    "auto-merge on green."
)
RETIRED_MERGE_SENTENCES = (
    "That PR is labelled by blast radius: `ask` needs a human, `show` and `ship` "
    "auto-merge on green.",
    "There are no Ship/Show/Ask tiers here, so that PR auto-merges on green too.",
)
# What the retired merge tiers left in an adopted repo. adopt removes them on its next run.
RETIRED_TIER_FILES = (
    ".github/workflows/ship-show-ask.yml",
    "scripts/ship_show_ask.py",
    ".github/tiers.json",
)
RETIRED_TIER_KEYS = ("tiers", "askGatesMerge", "codeowners", "showChannel")
GENERATED_CODEOWNERS = "# GENERATED by `run-sdlc adopt`"
# What the old templates opened with; a file without it is the repo's own.
TIER_SCRIPT_MARKER = '"""Classify a set of changed paths into one merge tier'
TIER_JSON_MARKER = '"_comment": "Ship/Show/Ask by blast radius.'


def render(text: str, values: dict[str, str]) -> str:
    """`{{NAME}}` tokens only (uppercase, underscores) -- `${{ secrets.X }}` is untouched.
    `{{#block}}...{{/block}}` is kept when values[block] is truthy, dropped otherwise.
    Blocks nest: the outer one is resolved first, then the pass repeats on what it kept."""

    def block(m: re.Match[str]) -> str:
        return m.group(2) if values.get(m.group(1)) else ""

    n = 1
    while n:
        text, n = re.subn(r"\{\{#(\w+)\}\}\n?(.*?)\{\{/\1\}\}\n?", block, text, flags=re.DOTALL)
    return re.sub(r"\{\{([A-Z_]+)\}\}", lambda m: values.get(m.group(1), m.group(0)), text)


E2E_CMD = re.compile(r"playwright|test:e2e")
# `--repeat-each` is a Playwright flag, so it marks an E2E check even behind a wrapper script
# (samplewerk: `sh scripts/e2e.sh --repeat-each 3`). The match covers its own value.
WHOLE_SUITE_REPEAT = re.compile(r"\s*--repeat-each(?:=|\s+)\S+")
MAX_FAILURES = re.compile(r"--max-failures(?:=|\s+)\S+")


def migrate_test_cost(cfg: dict, preset: str) -> None:
    """Bring an adopted repo's test cost in line with the preset (measured in leadhub: a
    `--repeat-each 3` over the whole suite took 59-71 min per gate, and the Stop hook fell back
    to the full `verify` 760 times). Adds `verifyStop`, and turns a whole-suite repeat into a
    single run in place: the repeat goes, the preset's `--max-failures` comes, and the repo's own
    command and flags stay. `lock.json` hashes `checks`, so every open change then needs the
    engineer's OK again -- adopt lists them and never re-locks."""
    base = json.loads((TPL / "presets" / f"{preset}.json").read_text(encoding="utf-8"))
    if not cfg.get("verifyStop") and base.get("verifyStop"):
        cfg["verifyStop"] = base["verifyStop"]
        wrote.append(f"sdlc.json: verifyStop added: {base['verifyStop']}")
    # The node preset speaks pnpm. In an npm repo a pnpm verifyStop fails every Stop
    # (omr-edu-bundle-app), so translate it to the package manager the lockfile names.
    stop = cfg.get("verifyStop") or ""
    if (
        stop.startswith("pnpm ")
        and (ROOT / "package-lock.json").exists()
        and not (ROOT / "pnpm-lock.yaml").exists()
    ):
        npm = re.sub(r"\bpnpm exec\b", "npx", stop)
        npm = re.sub(r"\bpnpm (?:run )?(?=[\w:-])", "npm run ", npm)
        cfg["verifyStop"] = npm
        wrote.append(f"sdlc.json: verifyStop `{stop}` -> `{npm}` (this repo uses npm)")
    preset_e2e = " ".join(
        c for c in base.get("checks", {}).get("milestone", []) if E2E_CMD.search(c)
    )
    found = MAX_FAILURES.search(preset_e2e)
    fail_fast = found.group(0) if found else "--max-failures=10"
    milestone = cfg.get("checks", {}).get("milestone", [])
    moved = False
    for i, check in enumerate(milestone):
        cmd = check["run"] if isinstance(check, dict) else check
        if not WHOLE_SUITE_REPEAT.search(cmd) or "--only-changed" in cmd or "--grep" in cmd:
            continue
        new = WHOLE_SUITE_REPEAT.sub("", cmd)
        if not MAX_FAILURES.search(new):
            new = f"{new} {fail_fast}"
        if isinstance(check, dict):
            check["run"] = new
        else:
            milestone[i] = new
        wrote.append(f"sdlc.json: checks.milestone `{cmd}` -> `{new}`")
        moved = True
    if not moved:
        return
    changes = ROOT / cfg.get("changesDir", "changes")
    for folder in sorted(changes.glob("*")) if changes.is_dir() else ():
        if folder.is_dir() and folder.name != "archive" and (folder / "lock.json").exists():
            manual.append(
                f"{folder.name}: its lock.json hashed the old checks, so the gate blocks with "
                f"protected-path. Record your OK: run `python3 scripts/verify_gate.py approve "
                f"{folder.name}` yourself (the agent never re-locks) and commit lock.json"
            )


def main() -> int:
    preset = detect_preset()
    cfg_path = ROOT / "sdlc.json"
    if cfg_path.exists():
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
        cfg["kitTemplates"] = templates_hash()
        kept.append("sdlc.json")
    else:
        cfg = json.loads((TPL / "presets" / f"{preset}.json").read_text(encoding="utf-8"))
        cfg["defaultBranch"] = default_branch()
        cfg["kitTemplates"] = templates_hash()
        write(cfg_path, json.dumps(cfg, indent=2, ensure_ascii=False) + "\n")
        manual.append(
            f"sdlc.json was created from the {preset} preset -- check linear.team/project, verify, blocked"
        )

    # --- migration: the 2026-09-07 layout decision. `.changes/` -> `changes/` (visible: it is
    # the audit trail, not scratch), `specs/` -> `docs/designs/` (a design is documentation),
    # `specsDir` -> `designsDir`, and `spec:` -> `design:` in every change artifact. Idempotent.
    if "specsDir" in cfg:
        cfg["designsDir"] = (
            "docs/designs" if cfg["specsDir"] in ("specs", "docs") else cfg.pop("specsDir")
        )
        cfg.pop("specsDir", None)
        wrote.append("sdlc.json: specsDir -> designsDir")
    if cfg.get("changesDir") == ".changes":
        cfg["changesDir"] = "changes"
        wrote.append("sdlc.json: changesDir .changes -> changes")
    if "sdlc.json" in kept:
        migrate_test_cost(cfg, preset)
        for key in RETIRED_TIER_KEYS:
            if key in cfg:
                del cfg[key]
                wrote.append(f"sdlc.json: `{key}` removed (merge tiers retired)")
    if not DRY and cfg_path.exists() and "sdlc.json" in kept:
        cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        # Not via write(): sdlc.json is the repo's own file and only gets fields merged in.
        # It still has to reach format_written(), or a prettier repo rejects the commit.
        written.append(cfg_path)
    changes_dir = cfg.get("changesDir", "changes")
    designs_dir = cfg.get("designsDir", "docs/designs")
    for old, new in ((ROOT / ".changes", ROOT / changes_dir), (ROOT / "specs", ROOT / designs_dir)):
        if old.is_dir() and old != new and not new.exists():
            wrote.append(f"{old.relative_to(ROOT)}/ -> {new.relative_to(ROOT)}/ (migrated)")
            if not DRY:
                new.parent.mkdir(parents=True, exist_ok=True)
                subprocess.run(["git", "mv", "-k", str(old), str(new)], cwd=ROOT, check=True)
                if old.exists():
                    old.rename(new)
    for md in (ROOT / changes_dir).rglob("*.md") if (ROOT / changes_dir).is_dir() else ():
        text = md.read_text(encoding="utf-8")
        if text.startswith("---\n") and re.search(r"^spec:", text, re.M):
            head, sep, body = text[4:].partition("\n---\n")
            head = re.sub(
                r"^spec:(.*)$",
                lambda mm: "design:" + mm.group(1).replace("specs/", designs_dir + "/"),
                head,
                count=1,
                flags=re.M,
            )
            body = body.replace("## Spec changes", "## Design changes").replace(
                "`spec:`", "`design:`"
            )
            wrote.append(f"{md.relative_to(ROOT)}: spec: -> design:")
            if not DRY:
                md.write_text("---\n" + head + sep + body, encoding="utf-8")
    review_md = ROOT / "REVIEW.md"  # repo-owned and kept, so its paths are patched, not regenerated
    if review_md.exists() and ".changes/" in review_md.read_text(encoding="utf-8"):
        wrote.append(f"REVIEW.md: .changes/ -> {changes_dir}/")
        if not DRY:
            review_md.write_text(
                review_md.read_text(encoding="utf-8").replace(".changes/", changes_dir + "/"),
                encoding="utf-8",
            )
    docs = cfg.get("docs", "docs/sdlc.md")
    today = dt.date.today().isoformat()
    keep_paths = set(cfg.get("keep", []))

    def _write(path: Path, text: str, **kw: object) -> None:
        if str(path.relative_to(ROOT)) in keep_paths:
            kept.append(str(path.relative_to(ROOT)) + " (sdlc.json keep)")
            return
        write(path, text, **kw)  # type: ignore[arg-type]

    # --- hooks + settings.json
    hooks_dir = ROOT / ".claude" / "hooks"
    for src in sorted((TPL / "hooks").glob("*.sh")):
        _write(hooks_dir / src.name, src.read_text(encoding="utf-8"), executable=True)

    settings_path = ROOT / ".claude" / "settings.json"
    settings = (
        json.loads(settings_path.read_text(encoding="utf-8")) if settings_path.exists() else {}
    )
    deny = settings.setdefault("permissions", {}).setdefault("deny", [])
    for rule in ("Read(.env*)", "Read(**/secrets/**)", "Read(**/.secrets/**)"):
        if rule not in deny:
            deny.append(rule)
    hooks = settings.setdefault("hooks", {})
    # Hooks the earlier, repo-local layout shipped under other names: unregister and remove.
    for legacy in ("ruff-on-edit.sh",):
        for event, groups in list(hooks.items()):
            for g in groups:
                g["hooks"] = [h for h in g.get("hooks", []) if legacy not in h.get("command", "")]
            hooks[event] = [g for g in groups if g.get("hooks")]
        old = hooks_dir / legacy
        if old.exists():
            wrote.append(f".claude/hooks/{legacy} (removed: replaced by lint-on-edit.sh)")
            if not DRY:
                subprocess.run(
                    ["git", "rm", "-qf", "--ignore-unmatch", str(old)], cwd=ROOT, check=True
                )
                if old.exists():
                    old.unlink()
    # A LIST, not a dict keyed by event: PreToolUse carries two entries -- gate-bash.sh for
    # what sdlc.json blocks, chain-gate.sh for the chain's own gates -- and a dict silently
    # kept only the last one.
    spec = [
        ("SessionStart", None, "session-check.sh", 5),
        ("PermissionRequest", "ExitPlanMode", "plan-gate.sh", 345600),
        ("PreToolUse", "Bash", "gate-bash.sh", 5),
        ("PreToolUse", "Edit|Write", "chain-gate.sh", 5),
        ("PostToolUse", "Edit|Write", "lint-on-edit.sh", 30),
        ("Stop", None, "verify-on-stop.sh", 300),
    ]
    for event, matcher, script, timeout in spec:
        groups = hooks.setdefault(event, [])
        entry = {
            "type": "command",
            "command": f'"$CLAUDE_PROJECT_DIR"/.claude/hooks/{script}',
            "timeout": timeout,
        }
        if any(script in h.get("command", "") for g in groups for h in g.get("hooks", [])):
            continue
        group = {"hooks": [entry]}
        if matcher:
            group = {"matcher": matcher, **group}
        groups.append(group)
    write(settings_path, json.dumps(settings, indent=2) + "\n")

    # A global gitignore that hides `.claude/*` would leave the hooks working on one laptop.
    ignored = (
        subprocess.run(
            ["git", "check-ignore", "-q", ".claude/hooks/gate-bash.sh"], cwd=ROOT
        ).returncode
        == 0
    )
    if ignored:
        gi = ROOT / ".gitignore"
        lines = gi.read_text(encoding="utf-8").splitlines() if gi.exists() else []
        add = [
            line
            for line in (
                "!.claude/",
                "!.claude/settings.json",
                "!.claude/hooks/",
                "!.claude/hooks/*.sh",
            )
            if line not in lines
        ]
        if add:
            write(
                gi,
                "\n".join(lines + ["", "# the SDLC hooks are the repo's, not the laptop's"] + add)
                + "\n",
            )

    # --- migration: the merge tiers are retired (2026-10-31). The PR into the default branch
    # merges under the repo's own branch protection, so their files go. CODEOWNERS only when
    # adopt generated it; a hand-written one is the repo's.
    retired = any(w.startswith("sdlc.json: `") and "(merge tiers retired)" in w for w in wrote)

    def retire(path: Path, why: str, generated: bool) -> None:
        nonlocal retired
        rel = str(path.relative_to(ROOT))
        if not path.exists():
            return
        if rel in keep_paths:
            kept.append(rel + " (sdlc.json keep)")
        elif not generated:
            kept.append(rel + " (hand-written, not adopt's)")
        else:
            remove(path, why)
            retired = True

    for rel in RETIRED_TIER_FILES:
        path = ROOT / rel
        head = path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""
        generated = {
            "scripts/ship_show_ask.py": head.startswith(TIER_SCRIPT_MARKER),
            ".github/tiers.json": TIER_JSON_MARKER in head,
        }.get(rel, True)
        retire(path, "merge tiers retired", generated)
    co_path = ROOT / ".github" / "CODEOWNERS"
    co_head = co_path.read_text(encoding="utf-8") if co_path.exists() else ""
    retire(
        co_path, "generated for the retired merge tiers", co_head.startswith(GENERATED_CODEOWNERS)
    )
    if retired:
        manual.append(
            f"ruleset on {cfg.get('defaultBranch', 'master')}: remove the GitHub App from the "
            "pull_request bypass actors; delete the secrets CODE_MANAGER_APP_CLIENT_ID, "
            "CODE_MANAGER_APP_PRIVATE_KEY, SDLC_SLACK_BOT_TOKEN and the variable SDLC_COOWNER "
            "(the tier workflow that used them is gone)"
        )
    # The verify contract runs in CI and in /goal, where no plugin is installed: a copy.
    for script in ("verify_gate.py", "sdlc_status.py", "design_index.py", "marks.py"):
        _write(ROOT / "scripts" / script, (TPL / "scripts" / script).read_text(encoding="utf-8"))
    gi = ROOT / ".gitignore"
    gi_lines = gi.read_text(encoding="utf-8").splitlines() if gi.exists() else []
    verify_out = f"/{changes_dir}/*/verify/"
    if verify_out not in gi_lines:
        write(
            gi,
            "\n".join(gi_lines + ["# verify_gate.py output; lock.json is committed", verify_out])
            + "\n",
        )
    if not (cfg.get("tracker") or (cfg.get("linear") or {}).get("team")):
        manual.append(
            "tracker: none set -- run `sdlc-run tracker` to choose Linear, GitHub or Beads and set it up"
        )
    # --- workflows
    ci_name = "CI"
    ci = ROOT / ".github" / "workflows" / "ci.yml"
    if ci.exists():
        m = re.search(r"^name:\s*(.+)$", ci.read_text(encoding="utf-8"), re.M)
        if m:
            ci_name = m.group(1).strip().strip("\"'")
    setup = {
        "node": "      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # v6.1.0\n        if: steps.key.outputs.present == 'true'\n      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0\n        if: steps.key.outputs.present == 'true'\n        with:\n          node-version-file: package.json\n          cache: pnpm\n      - run: pnpm install --frozen-lockfile\n        if: steps.key.outputs.present == 'true'\n",
        "python": "      - uses: astral-sh/setup-uv@c771a70e6277c0a99b617c7a806ffedaca235ff9 # v9.0.0\n        if: steps.key.outputs.present == 'true'\n        with:\n          enable-cache: true\n",
    }[preset]
    values = {
        "CHANGES_DIR": changes_dir,
        "DOCS": docs,
        "DESIGNS_DIR": cfg.get("designsDir", "docs/designs"),
        "DEFAULT_BRANCH": cfg.get("defaultBranch", "master"),
        "VERIFY": cfg["verify"],
        "VERIFY_STOP": cfg.get("verifyStop", cfg["verify"]),
        "TOOLS_COMMAND": cfg["toolsCommand"],
        "CI_WORKFLOW": ci_name,
        "SETUP_STEP": setup.rstrip("\n"),
        "CLAUDE_ALLOW": ",".join(
            ["Edit", "MultiEdit", "Write", "Read", "Glob", "Grep"] + cfg.get("claudeAllow", [])
        ),
    }
    # sdlc.json `claude` (default true): the three workflows that spend Anthropic tokens --
    # claude-review.yml (+ its merge-gate), claude.yml (@claude), ci-triage.yml. False writes
    # none of them and removes any that exist.
    CLAUDE_WORKFLOWS = ("claude-review.yml", "claude.yml", "ci-triage.yml")
    claude_on = cfg.get("claude", True)
    for src in sorted((TPL / "workflows").glob("*.yml")):
        dest = ROOT / ".github" / "workflows" / src.name
        if src.name in CLAUDE_WORKFLOWS and not claude_on:
            remove(dest, "sdlc.json claude=false")
            continue
        _write(dest, render(src.read_text(encoding="utf-8"), values))

    # --- GitHub issue and PR templates
    # Written once, then the repo owns them: a team that adds a field to its bug form should
    # not have it reverted by the next `adopt`. The shapes mirror the Linear templates in
    # cct:linear-manage, so an issue reads the same whichever tracker it started in.
    for src in sorted((TPL / "github" / "ISSUE_TEMPLATE").iterdir()):
        write(
            ROOT / ".github" / "ISSUE_TEMPLATE" / src.name,
            src.read_text(encoding="utf-8"),
            keep=True,
        )
    write(
        ROOT / ".github" / "PULL_REQUEST_TEMPLATE.md",
        (TPL / "github" / "PULL_REQUEST_TEMPLATE.md").read_text(encoding="utf-8"),
        keep=True,
    )

    # --- REVIEW.md (kept once written), docs, CLAUDE.md
    write(
        ROOT / "REVIEW.md",
        render((TPL / "REVIEW.md").read_text(encoding="utf-8"), values),
        keep=True,
    )

    tests = cfg.get("tests", "vitest")
    test_rel = cfg.get("testFile") or (
        "tests/test_sdlc.py" if tests == "pytest" else "tests/sdlc.test.ts"
    )
    values["TEST_PATH"] = test_rel
    docs_path = ROOT / docs
    tail = ""
    # The skill was also published as `run-sdlc`; a repo adopted under that name carries its
    # marker, and missing it silently dropped the repo's own section on the next adopt.
    markers = (
        "<!-- sdlc-run adopt keeps everything below this line -->",
        "<!-- run-sdlc adopt keeps everything below this line -->",
    )
    current = docs_path.read_text(encoding="utf-8") if docs_path.exists() else ""
    for marker in markers:
        if marker in current:
            tail = current.split(marker, 1)[1].strip("\n")
            break
    body = render((TPL / "docs-sdlc.md").read_text(encoding="utf-8"), values).rstrip("\n") + "\n"
    _write(docs_path, body + (tail + "\n" if tail else ""))

    claude_md = ROOT / "CLAUDE.md"
    text = claude_md.read_text(encoding="utf-8") if claude_md.exists() else f"# {ROOT.name}\n"
    section = render((TPL / "CLAUDE-section.md").read_text(encoding="utf-8"), values)
    if docs not in text:
        write(claude_md, text.rstrip("\n") + "\n" + section)
    elif re.search(r"`\.changes/|specs in `", text):
        # The section from before the 2026-09-07 layout decision: replace it in place, keep
        # everything around it (it is the one generated block inside a repo-owned file).
        start = text.find("## How work moves: the SDLC")
        end_marker = "dirty source files.\n"
        end = text.find(end_marker, start)
        if end < 0:
            end_marker = "when source files are dirty.\n"
            end = text.find(end_marker, start)
        if start >= 0 and end >= 0:
            write(claude_md, text[:start] + section.lstrip("\n") + text[end + len(end_marker) :])
        else:
            manual.append(
                "CLAUDE.md: the SDLC section still says .changes/ or specs/ -- update it by hand"
            )
            kept.append("CLAUDE.md")
    elif any(old in text for old in RETIRED_MERGE_SENTENCES):
        # The merge sentence in the generated section of a repo-owned file: swapped in place,
        # so CLAUDE.md does not promise a merge tier that is gone.
        for old in RETIRED_MERGE_SENTENCES:
            text = text.replace(old, MERGE_SENTENCE)
        write(claude_md, text)
    else:
        kept.append("CLAUDE.md")

    # --- guardrail test
    test_path = ROOT / test_rel
    depth = len(Path(test_rel).parents) - 1
    tvals = {"ROOT_REL": "/".join([".."] * depth) or ".", "ROOT_DEPTH": str(depth)}
    src = TPL / "tests" / ("test_sdlc.py" if tests == "pytest" else "sdlc.test.ts")
    _write(test_path, render(src.read_text(encoding="utf-8"), tvals))
    if tests != "pytest":
        manual.append(
            f"vitest: make sure the config's `include` covers {test_rel} (the file sets its own 120s testTimeout)"
        )

    # --- migrations: goals/ (the earlier layout) and .claude/plans/ (the tool's scratch)
    goals = ROOT / "goals"
    archive = ROOT / changes_dir / "archive"
    if goals.is_dir():
        for g in sorted(p for p in goals.iterdir() if p.is_dir()):
            if not any(g.iterdir()):
                # `git mv` refuses an empty directory ("fatal: source directory is empty") and
                # used to abort the whole adopt. There is nothing in it to migrate either.
                wrote.append(f"{g.relative_to(ROOT)}/ (empty -- removed, nothing to migrate)")
                if not DRY:
                    g.rmdir()
                continue
            m = re.match(r"(\d{4}-\d{2}-\d{2})-(.+)", g.name)
            date, slug = (m.group(1), m.group(2)) if m else (today, g.name)
            key = ""
            for name in ("intent.md", "plan.md", "facts.md"):
                fm = (
                    re.search(
                        r"^linear:\s*([A-Z][A-Z0-9]+-\d+)",
                        (g / name).read_text(encoding="utf-8"),
                        re.M,
                    )
                    if (g / name).exists()
                    else None
                )
                if fm:
                    key = fm.group(1)
                    break
            dest = archive / change_id(date, key, slug)
            wrote.append(
                f"{g.relative_to(ROOT)} -> {dest.relative_to(ROOT)} (migrated; goal.md folded into plan.md '## Done')"
            )
            manual.append(
                f"{dest.relative_to(ROOT)}: read plan.md -- `## Order of work` and `## Revisions` may be missing (the test wants them); set `design:` and `linear:` if known"
            )
            if not DRY:
                dest.parent.mkdir(parents=True, exist_ok=True)
                mv = subprocess.run(
                    ["git", "mv", str(g), str(dest)], cwd=ROOT, capture_output=True, text=True
                )
                if mv.returncode != 0:
                    # Never fatal: a folder git does not track ("fatal: not under version
                    # control") still has to move, and aborting here would also skip
                    # format_written(). A plain rename does the same job without the index.
                    shutil.move(str(g), str(dest))
                goal_md = dest / "goal.md"
                plan_md = dest / "plan.md"
                if goal_md.exists():
                    done = goal_md.read_text(encoding="utf-8").split("## Done condition", 1)
                    if plan_md.exists() and "## Done" not in plan_md.read_text(encoding="utf-8"):
                        plan_md.write_text(
                            plan_md.read_text(encoding="utf-8").rstrip("\n")
                            + "\n\n## Done\n"
                            + (done[1] if len(done) > 1 else "\n"),
                            encoding="utf-8",
                        )
                    subprocess.run(["git", "rm", "-qf", str(goal_md)], cwd=ROOT, check=True)
                for md in dest.glob("*.md"):
                    text = md.read_text(encoding="utf-8")
                    if not text.startswith("---\n"):
                        # A plannotator run before the chain had a frontmatter: give it the minimum.
                        text = (
                            f"---\nlinear: {key or 'none'}\ntype: {md.stem}\nchange: {dest.name}\ndesign: null\nauthor: {git_email()}\nstatus: approved\ncreated: {date}\n---\n\n"
                            + text
                        )
                    text = re.sub(
                        r"^goal:\s*(.+)$",
                        # Grund fuer das noqa unten: das Lambda wird von re.sub() in derselben
                        # Iteration verbraucht, dest kann nicht weiterlaufen.
                        lambda mm: f"change: {dest.name}",  # noqa: B023
                        text,
                        count=1,
                        flags=re.M,
                    )
                    head, sep, body = text[4:].partition("\n---\n")  # inside the frontmatter block
                    fields = {
                        "change": dest.name,
                        "design": "null",
                        "archived_at": today,
                        "created": date,
                    }
                    for k, v in fields.items():
                        if not re.search(rf"^{k}:", head, re.M):
                            head += f"\n{k}: {v}"
                    if md.name == "plan.md" and "## Revisions" not in body:
                        body = (
                            body.rstrip("\n") + "\n\n## Revisions\n\nNone — archived as approved.\n"
                        )
                    md.write_text("---\n" + head + sep + body, encoding="utf-8")
        if not DRY and not any(goals.iterdir()):
            goals.rmdir()
    plans = ROOT / ".claude" / "plans"
    if plans.is_dir() and any(plans.iterdir()):
        hist = ROOT / "docs" / "history" / "plans"
        wrote.append(
            f".claude/plans/ -> {hist.relative_to(ROOT)}/ (migrated: {sum(1 for _ in plans.iterdir())} files)"
        )
        if not DRY:
            hist.mkdir(parents=True, exist_ok=True)
            for f in sorted(plans.iterdir()):
                subprocess.run(
                    ["git", "mv", "-k", str(f), str(hist / f.name)], cwd=ROOT, check=True
                )
                if f.exists():
                    f.rename(hist / f.name)
            plans.rmdir()

    # --- the first change: adopting the chain is itself a change
    changes = ROOT / changes_dir
    migrate_change_ids(changes, today)
    migrate_archive_layout(changes)
    migrate_decision_log(ROOT / designs_dir, today)
    write_design_index(ROOT / designs_dir)
    ticket = sys.argv[sys.argv.index("--ticket") + 1] if "--ticket" in sys.argv else ""
    first = changes / change_id(today, ticket, "adopt-sdlc")
    has_open = changes.exists() and any(
        p.is_dir() and p.name != "archive" for p in changes.iterdir()
    )
    has_archived = archive.exists() and any(p.is_dir() for p in archive.iterdir())
    # A repo that already ran the chain (migrated or not) adopted it back then; no new first change.
    if not has_open and not has_archived:
        cvals = {
            "LINEAR": ticket or "none",
            "CHANGE": first.name,
            "DESIGN": "null",
            "AUTHOR": git_email(),
            "DATE": today,
            "TITLE": f"Adopt the AI-native SDLC in {ROOT.name}",
            "VERIFY": cfg["verify"],
        }
        for name in ("intent.md", "facts.md", "plan.md"):
            write(first / name, render((TPL / "change" / name).read_text(encoding="utf-8"), cvals))
        manual.append(
            f"{first.relative_to(ROOT)}/ is the first change: fill intent/facts/plan from this adoption, gate the plan, archive it when the PR is green"
        )
    (archive).mkdir(parents=True, exist_ok=True) if not DRY else None
    gitkeep = archive / ".gitkeep"
    if not DRY and not any(archive.iterdir()):
        gitkeep.write_text("")

    secrets = ["ANTHROPIC_API_KEY (org secret)"] if claude_on else []
    manual.extend(
        [
            "add the tools target: `{}` -> plannotator install (see {}, 'Install once per machine')".format(
                cfg["toolsCommand"], docs
            ),
            *(["GitHub: " + ", ".join(secrets)] if secrets else []),
            "ruleset on {}: required checks = CI{}; strict=false; thread resolution=false".format(
                cfg.get("defaultBranch", "master"),
                " + merge-gate"
                if claude_on
                else " (no merge-gate: claude=false -- remove it from the ruleset AND classic branch protection if it is there)",
            ),
            "run `{}` and the guardrail test; commit as `feat(sdlc): adopt the chain`".format(
                cfg["verify"]
            ),
        ]
    )

    format_written()

    print("-#-#- WROTE -#-#-")
    print("\n".join(wrote) or "(nothing)")
    print("-#-#- KEPT -#-#-")
    print("\n".join(kept) or "(nothing)")
    print("-#-#- MANUAL -#-#-")
    print("\n".join(f"- {m}" for m in manual))
    if DRY:
        print("(dry run: nothing written)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    finally:
        # A crash mid-adopt must not leave files in the templates' own formatting: whatever
        # already reached disk still gets the repo's formatter. `written` is cleared by the
        # call inside main(), so this is a no-op after a clean run.
        format_written()
