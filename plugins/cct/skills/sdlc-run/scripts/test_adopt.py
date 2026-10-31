"""adopt.py renders the chain into a repo; this proves the render, not the chain.

A throwaway git repo per test (node or python by marker file), adopt run on it, then:
every generated file exists, no `{{TOKEN}}` survives, hooks are executable and do what
sdlc.json says, a second run writes nothing, and the merge-label files an earlier version
installed are removed.
The rendered guardrail test itself runs in the adopting repo's CI, not here.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent
ADOPT = SCRIPTS / "adopt.py"
TOKEN = re.compile(r"\{\{[A-Z_]+\}\}|\{\{#\w+\}\}|\{\{/\w+\}\}")
# A rendered file that still names the merge labels the SDLC no longer has.
TIER_WORDS = re.compile(r"ship.?show.?ask|ship_show_ask|tiers\.json|\btiers\b", re.I)
MERGE_SENTENCE = "That PR merges by the repo's own branch protection: auto-merge on green."
LEGACY_TIER_FILES = (
    ".github/workflows/ship-show-ask.yml",
    "scripts/ship_show_ask.py",
    ".github/tiers.json",
)


def _env() -> dict[str, str]:
    return {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}


def _repo(tmp_path: Path, kind: str) -> Path:
    repo = tmp_path / "repo"
    repo.mkdir()
    env = _env()
    subprocess.run(["git", "init", "-q", "-b", "master"], cwd=repo, check=True, env=env)
    (repo / ("package.json" if kind == "node" else "pyproject.toml")).write_text(
        "{}\n" if kind == "node" else "[project]\nname='x'\n"
    )
    (repo / "CLAUDE.md").write_text("# repo\n")
    (repo / ".github" / "workflows").mkdir(parents=True)
    (repo / ".github" / "workflows" / "ci.yml").write_text("name: Checks\non: [push]\n")
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "init"],
        cwd=repo,
        check=True,
        env=env,
    )
    return repo


def _adopt(repo: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(ADOPT), *args], cwd=repo, capture_output=True, text=True, env=_env()
    )


def _sections(out: str) -> dict[str, list[str]]:
    parts = re.split(r"-#-#- (\w+) -#-#-\n", out)
    return {
        parts[i]: [line for line in parts[i + 1].splitlines() if line and line != "(nothing)"]
        for i in range(1, len(parts), 2)
    }


GENERATED = [
    "sdlc.json",
    ".claude/settings.json",
    ".claude/hooks/sdlc-config.sh",
    ".claude/hooks/chain-gate.sh",
    ".claude/hooks/gate-bash.sh",
    ".claude/hooks/lint-on-edit.sh",
    ".claude/hooks/plan-gate.sh",
    ".claude/hooks/session-check.sh",
    ".claude/hooks/verify-on-stop.sh",
    ".github/workflows/claude-review.yml",
    ".github/workflows/claude.yml",
    ".github/workflows/ci-triage.yml",
    "scripts/verify_gate.py",
    "scripts/marks.py",
    "scripts/sdlc_status.py",
    "REVIEW.md",
    "docs/sdlc.md",
]


@pytest.mark.parametrize(
    "kind,test_file", [("node", "tests/sdlc.test.ts"), ("python", "tests/test_sdlc.py")]
)
def test_adopt_renders_everything_without_leftover_tokens(
    tmp_path: Path, kind: str, test_file: str
) -> None:
    repo = _repo(tmp_path, kind)
    result = _adopt(repo)
    assert result.returncode == 0, result.stderr
    for rel in GENERATED + [test_file]:
        assert (repo / rel).is_file(), rel
    for rel in GENERATED + [test_file, "CLAUDE.md"]:
        text = (repo / rel).read_text(encoding="utf-8")
        assert not TOKEN.search(text), f"{rel}: unrendered token {TOKEN.search(text).group(0)}"
    for hook in (repo / ".claude" / "hooks").glob("*.sh"):
        assert os.access(hook, os.X_OK), hook.name
    changes = [p for p in (repo / "changes").iterdir() if p.is_dir() and p.name != "archive"]
    first = f"{dt.date.today().isoformat()}-adopt-sdlc"
    assert [c.name for c in changes] == [first]
    assert "## Problem" in (changes[0] / "intent.md").read_text()
    plan = (changes[0] / "plan.md").read_text()
    for section in ("## Order of work", "## Done", "## Revisions", "## Design changes"):
        assert section in plan, section
    assert f"change: {first}" in plan and "linear: none" in plan
    assert (
        "/goal" in (repo / "CLAUDE.md").read_text()
        and "sdlc-run" in (repo / "CLAUDE.md").read_text()
    )
    assert "docs/sdlc.md" in (repo / "CLAUDE.md").read_text()
    assert "workflows: [Checks]" in (repo / ".github" / "workflows" / "ci-triage.yml").read_text()
    for rel in LEGACY_TIER_FILES + (".github/CODEOWNERS",):
        assert not (repo / rel).exists(), rel
    for rel in GENERATED + [test_file, "CLAUDE.md"]:
        hit = TIER_WORDS.search((repo / rel).read_text(encoding="utf-8"))
        assert not hit, f"{rel}: names merge labels ({hit.group(0)!r})"
    # claude.yml is rendered per preset. It was once committed rendered-in-place (63f3c1a),
    # which gave every Python repo a pnpm setup step and a pnpm allow-list.
    claude_yml = (repo / ".github" / "workflows" / "claude.yml").read_text()
    if kind == "python":
        assert "setup-uv" in claude_yml and "pnpm" not in claude_yml, (
            "python preset rendered with a node setup"
        )
    else:
        assert "pnpm install" in claude_yml and "setup-uv" not in claude_yml


def test_second_run_writes_nothing(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    second = _sections(_adopt(repo).stdout)
    assert second["WROTE"] == [], second["WROTE"]


def test_pretooluse_keeps_both_hooks(tmp_path: Path) -> None:
    # The spec used to be a dict keyed by event, so the second PreToolUse entry overwrote
    # the first and one of the two gates was simply absent from every adopted repo.
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    settings = json.loads((repo / ".claude" / "settings.json").read_text(encoding="utf-8"))
    pre = [h["command"] for g in settings["hooks"]["PreToolUse"] for h in g["hooks"]]
    assert any("gate-bash.sh" in c for c in pre), pre
    assert any("chain-gate.sh" in c for c in pre), pre
    matchers = {g.get("matcher") for g in settings["hooks"]["PreToolUse"]}
    assert matchers == {"Bash", "Edit|Write"}, matchers
    # And a second adopt does not append them again.
    _adopt(repo)
    again = json.loads((repo / ".claude" / "settings.json").read_text(encoding="utf-8"))
    assert len([h for g in again["hooks"]["PreToolUse"] for h in g["hooks"]]) == 2


def test_dry_run_touches_nothing(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "python")
    out = _sections(_adopt(repo, "--dry-run").stdout)
    assert "sdlc.json" in out["WROTE"]
    assert not (repo / "sdlc.json").exists()


def test_rendered_hooks_read_sdlc_json(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "python")
    _adopt(repo)
    hooks = repo / ".claude" / "hooks"
    env = {**_env(), "CLAUDE_PROJECT_DIR": str(repo)}
    cfg = json.loads((repo / "sdlc.json").read_text())
    for rule in cfg["blocked"]:
        for cmd in rule["samples"]:
            r = subprocess.run(
                [str(hooks / "gate-bash.sh")],
                input=json.dumps({"tool_input": {"command": cmd}}),
                capture_output=True,
                text=True,
                env=env,
            )
            assert r.returncode == 2 and "BLOCKED" in r.stderr, cmd
    ok = subprocess.run(
        [str(hooks / "gate-bash.sh")],
        input=json.dumps({"tool_input": {"command": "git status"}}),
        capture_output=True,
        text=True,
        env=env,
    )
    assert ok.returncode == 0
    # verify-on-stop reads `verify` from sdlc.json: a failing verify blocks the stop.
    cfg["verify"] = "sh -c 'echo verify-ran; exit 1'"
    cfg.pop("verifyStop", None)  # the python preset has one; this test is about `verify`
    (repo / "sdlc.json").write_text(json.dumps(cfg))
    (repo / "x.py").write_text("x = 1\n")
    r = subprocess.run(
        [str(hooks / "verify-on-stop.sh")],
        input=json.dumps({"stop_hook_active": False}),
        capture_output=True,
        text=True,
        env=env,
    )
    assert r.returncode == 2 and "verify-ran" in r.stderr


def test_v3_keys_are_preserved_and_only_presets_add_them(tmp_path: Path) -> None:
    (tmp_path / "node").mkdir()
    (tmp_path / "python").mkdir()
    node = _repo(tmp_path / "node", "node")
    python = _repo(tmp_path / "python", "python")
    _adopt(node)
    _adopt(python)
    node_cfg = json.loads((node / "sdlc.json").read_text())
    py_cfg = json.loads((python / "sdlc.json").read_text())
    assert node_cfg["verifyStop"] == "pnpm format && pnpm lint && pnpm typecheck"
    assert py_cfg["verifyStop"] == "uv run ruff format --check . && uv run ruff check ."
    for key in ("planGate", "testGlobs", "prototypeDirs", "feedback"):
        assert key not in node_cfg and key not in py_cfg

    node_cfg.update(
        verifyStop="pnpm fast",
        planGate="self",
        testGlobs=["custom/**/*.test.ts"],
        prototypeDirs=["design/prototypes"],
        feedback=["docs/feedback/*.md"],
    )
    (node / "sdlc.json").write_text(json.dumps(node_cfg, indent=2) + "\n")
    _adopt(node)
    after = json.loads((node / "sdlc.json").read_text())
    assert after["verifyStop"] == "pnpm fast"
    assert after["planGate"] == "self"
    assert after["testGlobs"] == ["custom/**/*.test.ts"]
    assert after["prototypeDirs"] == ["design/prototypes"]
    assert after["feedback"] == ["docs/feedback/*.md"]


def _old_cfg(repo: Path, milestone: list[str]) -> None:
    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg.pop("verifyStop", None)
    cfg["checks"]["milestone"] = milestone
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")


def test_migrates_a_whole_suite_repeat_and_adds_verify_stop(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    _old_cfg(repo, ["pnpm test", "pnpm test:e2e --repeat-each 3"])
    for name in ("2026-10-01-open", "2026-10-02-draft"):
        (repo / "changes" / name).mkdir(parents=True)
    (repo / "changes" / "2026-10-01-open" / "lock.json").write_text("{}\n")
    (repo / "changes" / "archive" / "2026-09-01-old").mkdir(parents=True)
    (repo / "changes" / "archive" / "2026-09-01-old" / "lock.json").write_text("{}\n")

    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=_env())
    res = _adopt(repo)
    assert res.returncode == 0, res.stderr
    out = _sections(res.stdout)
    cfg = json.loads((repo / "sdlc.json").read_text())
    assert cfg["checks"]["milestone"] == ["pnpm test", "pnpm test:e2e --max-failures=10"]
    assert cfg["verifyStop"] == "pnpm format && pnpm lint && pnpm typecheck"
    assert any("verifyStop added" in w for w in out["WROTE"])
    assert any("--repeat-each 3" in w and "--max-failures=10" in w for w in out["WROTE"])
    approve = [m for m in out["MANUAL"] if "verify_gate.py approve" in m]
    assert len(approve) == 1 and "2026-10-01-open" in approve[0]


@pytest.mark.parametrize(
    "existing",
    [
        None,
        "pnpm format && pnpm lint && pnpm typecheck",
        "pnpm run format && pnpm lint && pnpm run typecheck",
    ],
)
def test_verify_stop_follows_an_npm_lockfile(tmp_path: Path, existing: str | None) -> None:
    repo = _repo(tmp_path, "node")
    (repo / "package-lock.json").write_text("{}\n")
    _adopt(repo)
    _old_cfg(repo, ["npm test"])
    if existing:
        cfg = json.loads((repo / "sdlc.json").read_text())
        cfg["verifyStop"] = existing
        (repo / "sdlc.json").write_text(json.dumps(cfg) + "\n")
    _adopt(repo)
    stop = json.loads((repo / "sdlc.json").read_text())["verifyStop"]
    assert stop == "npm run format && npm run lint && npm run typecheck"


@pytest.mark.parametrize(
    ("old", "new"),
    [
        # samplewerk: the repeat sat behind a wrapper script and adopt missed it
        ("sh scripts/e2e.sh --repeat-each 3", "sh scripts/e2e.sh --max-failures=10"),
        (
            "pnpm test:e2e --repeat-each=3 --project chromium",
            "pnpm test:e2e --project chromium --max-failures=10",
        ),
        ("pnpm test:e2e --max-failures=5 --repeat-each 3", "pnpm test:e2e --max-failures=5"),
    ],
)
def test_drops_a_whole_suite_repeat_in_place(tmp_path: Path, old: str, new: str) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    _old_cfg(repo, [old])
    _adopt(repo)
    assert json.loads((repo / "sdlc.json").read_text())["checks"]["milestone"] == [new]


@pytest.mark.parametrize(
    "cmd",
    ["pnpm test:e2e --only-changed --repeat-each 3", "pnpm test:e2e --grep @x --repeat-each 3"],
)
def test_leaves_a_scoped_repeat_alone(tmp_path: Path, cmd: str) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    _old_cfg(repo, [cmd])
    out = _sections(_adopt(repo).stdout)
    assert json.loads((repo / "sdlc.json").read_text())["checks"]["milestone"] == [cmd]
    assert not any("verify_gate.py approve" in m for m in out["MANUAL"])


def test_keeps_repo_owned_files_and_docs_tail(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    (repo / "REVIEW.md").write_text("# mine\n")
    docs = repo / "docs" / "sdlc.md"
    docs.write_text(docs.read_text() + "\n## Local rule\n\nkeep me\n")
    out = _sections(_adopt(repo).stdout)
    assert "REVIEW.md" in out["KEPT"]
    assert (repo / "REVIEW.md").read_text() == "# mine\n"
    assert "keep me" in docs.read_text()
    assert docs.read_text().count("# The SDLC") == 1


def test_keeps_docs_tail_under_the_run_sdlc_marker(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    docs = repo / "docs" / "sdlc.md"
    old = docs.read_text().replace("sdlc-run adopt keeps", "run-sdlc adopt keeps")
    docs.write_text(old + "\n## Local rule\n\nkeep me\n")
    _adopt(repo)
    assert "keep me" in docs.read_text()


def test_ticket_names_the_first_change(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo, "--ticket", "REV-947")
    first = repo / "changes" / f"{dt.date.today().isoformat()}-REV-947-adopt-sdlc"
    assert (first / "plan.md").exists()
    assert "linear: REV-947" in (first / "facts.md").read_text()


def test_migrates_goals_and_claude_plans(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "python")
    env = _env()
    goal = repo / "goals" / "2026-09-05-ai-native-sdlc"
    goal.mkdir(parents=True)
    fm = "---\nlinear: CPTO-947\ntype: %s\ngoal: 2026-09-05-ai-native-sdlc\nauthor: t@t\nstatus: approved\ncreated: 2026-09-05\n---\n"
    (goal / "intent.md").write_text(
        fm % "intent"
        + "# Intent\n\n## Problem\n\n## Proposed outcome\n\n## Affected users and systems\n\n## Constraints\n\n## Open questions\n"
    )
    (goal / "facts.md").write_text(fm % "facts" + "# Facts\n")
    (goal / "plan.md").write_text(fm % "plan" + "# Plan\n\n## Order of work\n\n1. x\n")
    (goal / "goal.md").write_text(
        fm % "goal" + "# Goal\n\n## Done condition\n\n- make verify exits 0\n"
    )
    plans = repo / ".claude" / "plans"
    plans.mkdir(parents=True)
    (plans / "2026-08-01T1200-handover-x.md").write_text("old handover\n")
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "old layout"],
        cwd=repo,
        check=True,
        env=env,
    )

    out = _sections(_adopt(repo).stdout)
    dest = repo / "changes" / "archive" / "2026" / "2026-09" / "2026-09-05-CPTO-947-ai-native-sdlc"
    assert dest.is_dir() and not (repo / "goals").exists()
    assert not (dest / "goal.md").exists()
    plan = (dest / "plan.md").read_text()
    assert "## Done" in plan and "make verify exits 0" in plan
    assert "change: 2026-09-05-CPTO-947-ai-native-sdlc" in plan and "archived_at:" in plan
    assert (repo / "docs" / "history" / "plans" / "2026-08-01T1200-handover-x.md").exists()
    assert not (repo / ".claude" / "plans").exists()
    # A migrated repo has an archived change, so no adopt-sdlc change is invented on top.
    assert any("migrated" in w for w in out["WROTE"])


def test_keep_list_protects_a_generated_file(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    wf = repo / ".github" / "workflows" / "ci-triage.yml"
    wf.write_text("# hand-tuned\n")
    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg["keep"] = [".github/workflows/ci-triage.yml"]
    (repo / "sdlc.json").write_text(json.dumps(cfg))
    out = _sections(_adopt(repo).stdout)
    assert wf.read_text() == "# hand-tuned\n"
    assert any("ci-triage.yml (sdlc.json keep)" in k for k in out["KEPT"])


def test_linear_safe_rewrites_repo_paths_and_refuses_local_ones(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    env = _env()
    subprocess.run(
        ["git", "remote", "add", "origin", "git@github.com:ramp106/example.git"],
        cwd=repo,
        check=True,
        env=env,
    )
    (repo / "docs").mkdir(exist_ok=True)
    (repo / "docs" / "x.md").write_text("x")
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "docs"],
        cwd=repo,
        check=True,
        env=env,
    )
    sha = subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=repo, capture_output=True, text=True, env=env
    ).stdout.strip()
    body = repo / "body.md"
    body.write_text(
        "See docs/x.md and `docs/x.md` but not docs/missing.md nor https://github.com/ramp106/example/blob/abc/docs/x.md\n"
    )
    r = subprocess.run(
        [sys.executable, str(SCRIPTS / "linear-safe.py"), str(body)],
        cwd=repo,
        capture_output=True,
        text=True,
        env=env,
    )
    assert r.returncode == 0, r.stderr
    assert f"[docs/x.md](https://github.com/ramp106/example/blob/{sha}/docs/x.md)" in r.stdout
    assert "docs/missing.md" in r.stdout and "[docs/missing.md]" not in r.stdout
    assert r.stdout.count("blob/abc/docs/x.md") == 1
    body.write_text("open ~/projects/x/specs/a.md or /Users/me/y.md\n")
    r = subprocess.run(
        [sys.executable, str(SCRIPTS / "linear-safe.py"), "--check", str(body)],
        cwd=repo,
        capture_output=True,
        text=True,
        env=env,
    )
    assert r.returncode == 2 and "REFUSED" in r.stderr and "1:" in r.stderr


def test_migrates_dot_changes_and_specs_to_changes_and_designs(tmp_path: Path) -> None:
    """The 2026-09-07 layout decision: `.changes/` -> `changes/`, `specs/` -> `docs/designs/`,
    `specsDir` -> `designsDir`, `spec:` -> `design:`, and the CLAUDE.md section refreshed."""
    repo = _repo(tmp_path, "node")
    env = _env()
    cfg = json.loads((SCRIPTS.parent / "templates" / "presets" / "node.json").read_text())
    cfg["changesDir"] = ".changes"
    cfg["specsDir"] = "specs"
    cfg.pop("designsDir", None)
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    change = repo / ".changes" / "REV-1-x"
    change.mkdir(parents=True)
    fm = "---\nlinear: REV-1\ntype: %s\nchange: REV-1-x\nspec: specs/2026-09-01-x.md\nauthor: t@t\nstatus: approved\ncreated: 2026-09-01\n---\n"
    (change / "facts.md").write_text(fm % "facts" + "# Facts\n")
    (change / "plan.md").write_text(
        fm % "plan"
        + "# Plan\n\n## Spec changes\n\nnone\n\n## Order of work\n\n- [ ] 1. x\n\n## Done\n\n- x\n\n## Revisions\n"
    )
    (repo / "specs").mkdir()
    (repo / "specs" / "2026-09-01-x.md").write_text("# x\n\n## Milestones\n\n- REV-1-x\n")
    (repo / "REVIEW.md").write_text("# Review\n\nwhat `.changes/<date>-<slug>/plan.md` says\n")
    (repo / "CLAUDE.md").write_text(
        "# repo\n\n## How work moves: the SDLC\n\nold text with `.changes/<TICKET>-<slug>/` and specs in `specs/`.\nthe reference is docs/sdlc.md\n\n## Verifying your work\n\n    pnpm test\n\nThe Stop hook runs it for you when source files are dirty.\n"
    )
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "old layout"],
        cwd=repo,
        check=True,
        env=env,
    )

    out = _sections(_adopt(repo).stdout)
    migrated = repo / "changes" / "2026-09-01-REV-1-x"
    assert (migrated / "plan.md").exists() and not (repo / ".changes").exists()
    assert (repo / "docs" / "designs" / "2026-09-01-x.md").exists() and not (
        repo / "specs"
    ).exists()
    plan = (migrated / "plan.md").read_text()
    assert "change: 2026-09-01-REV-1-x" in plan
    assert "design: docs/designs/2026-09-01-x.md" in plan and "spec:" not in plan
    assert "## Design changes" in plan
    new_cfg = json.loads((repo / "sdlc.json").read_text())
    assert (
        new_cfg["changesDir"] == "changes"
        and new_cfg["designsDir"] == "docs/designs"
        and "specsDir" not in new_cfg
    )
    claude = (repo / "CLAUDE.md").read_text()
    assert ".changes/" not in claude and "docs/designs/" in claude
    assert "`changes/<date>-<slug>/plan.md`" in (
        repo / "REVIEW.md"
    ).read_text() and claude.startswith("# repo\n")
    assert any(".changes/ -> changes/" in w for w in out["WROTE"])
    # No adopt-sdlc change invented on top of an existing change.
    assert not list((repo / "changes").glob("*-adopt-sdlc"))


def test_runs_the_repos_own_prettier_over_what_it_wrote(tmp_path: Path) -> None:
    """A repo with a `prettier --check` gate rejects a freshly written template, because the
    templates cannot match every printWidth and quote style. adopt calls the repo's prettier."""
    repo = _repo(tmp_path, "node")
    bin_dir = repo / "node_modules" / ".bin"
    bin_dir.mkdir(parents=True)
    stub = bin_dir / "prettier"
    stub.write_text('#!/bin/sh\nprintf "%s\\n" "$@" >> "$(dirname "$0")/../../prettier-argv.txt"\n')
    stub.chmod(0o755)

    _adopt(repo)

    argv = (repo / "prettier-argv.txt").read_text().splitlines()
    assert argv[0] == "--write", argv[:3]
    formatted = [a for a in argv if not a.startswith("--")]
    assert any(a.endswith("tests/sdlc.test.ts") for a in formatted), formatted
    assert any(a.endswith(".github/workflows/claude-review.yml") for a in formatted), formatted
    # sdlc.json on a SECOND run is the real case: it exists, so it takes the merge path
    # instead of write(), and it still has to reach prettier or the repo rejects the commit.
    (repo / "prettier-argv.txt").unlink()
    _adopt(repo)
    again = [
        a for a in (repo / "prettier-argv.txt").read_text().splitlines() if not a.startswith("--")
    ]
    assert any(a.endswith("sdlc.json") for a in again), again
    # Shell scripts and other non-prettier files are not handed to it.
    assert not any(a.endswith(".sh") for a in formatted), formatted


def test_without_prettier_installed_adopt_still_succeeds(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    out = _adopt(repo)
    assert out.returncode == 0, out.stderr
    assert not (repo / "node_modules").exists()


def test_stamps_templates_hash_and_status_reports_stale(tmp_path: Path) -> None:
    """The copied hooks, workflows and guardrail test run in CI, where no plugin exists, so
    they cannot read the skill. `adopt` stamps what it copied; `status.sh` says when a repo
    has fallen behind the installed kit."""
    repo = _repo(tmp_path, "node")
    _adopt(repo)
    want = subprocess.run(
        [sys.executable, str(ADOPT), "--templates-hash"], capture_output=True, text=True, env=_env()
    ).stdout.strip()
    assert len(want) == 12
    assert json.loads((repo / "sdlc.json").read_text())["kitTemplates"] == want

    def status() -> str:
        return subprocess.run(
            ["bash", str(SCRIPTS / "status.sh")],
            cwd=repo,
            capture_output=True,
            text=True,
            env=_env(),
        ).stdout

    assert "templates=current" in status()

    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg["kitTemplates"] = "deadbeef1234"
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    assert f"templates=stale (deadbeef1234 -> {want})" in status()

    _adopt(repo)
    assert json.loads((repo / "sdlc.json").read_text())["kitTemplates"] == want
    assert "templates=current" in status()


def test_nests_the_archive_and_fixes_a_misnamed_folder(tmp_path: Path) -> None:
    """A flat archive becomes <year>/<year-month>/, and a folder whose name-date is not its
    `created` date is renamed on the way. Measured in omr-leadhub: 52 archived changes in
    15 days, 2 of them named by their ARCHIVE date, so a name could not be read."""
    repo = _repo(tmp_path, "node")
    env = _env()
    fm = (
        "---\nlinear: %s\ntype: plan\nchange: %s\ndesign: null\nauthor: t@t\n"
        "status: approved\ncreated: %s\narchived_at: %s\n---\n\n# Plan\n\n"
        "## Order of work\n\n- [ ] 1. x\n\n## Done\n\n- x\n\n## Revisions\n"
    )
    arch = repo / "changes" / "archive"
    # Named by its creation date: only nested.
    ok = arch / "2026-08-11-REV-900-good-name"
    ok.mkdir(parents=True)
    (ok / "plan.md").write_text(fm % ("REV-900", ok.name, "2026-08-11", "2026-08-12"))
    # Named by its ARCHIVE date: renamed to 2026-09-09, then nested under 2026-09.
    bad = arch / "2026-09-10-REV-980-status-enum"
    bad.mkdir(parents=True)
    (bad / "plan.md").write_text(fm % ("REV-980", bad.name, "2026-09-09", "2026-09-10"))
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "flat archive"],
        cwd=repo,
        check=True,
        env=env,
    )
    _adopt(repo)

    assert (arch / "2026" / "2026-08" / "2026-08-11-REV-900-good-name" / "plan.md").is_file()
    renamed = arch / "2026" / "2026-09" / "2026-09-09-REV-980-status-enum"
    assert renamed.is_file() is False and renamed.is_dir()
    assert "change: 2026-09-09-REV-980-status-enum" in (renamed / "plan.md").read_text()
    # The flat folders are gone, and no empty shells are left behind.
    assert not ok.exists() and not bad.exists()
    assert sorted(p.name for p in arch.iterdir() if p.is_dir()) == ["2026"]

    # Idempotent: a second adopt moves nothing.
    assert _sections(_adopt(repo).stdout)["WROTE"] == []


def test_migrates_legacy_change_ids_and_drops_pending(tmp_path: Path) -> None:
    """Ids from before the date prefix are renamed, and `PENDING` becomes what it always
    meant: a change with no Linear issue. Open and archived folders both."""
    repo = _repo(tmp_path, "node")
    env = _env()
    fm = "---\nlinear: %s\ntype: plan\nchange: %s\ndesign: null\nauthor: t@t\nstatus: approved\ncreated: %s\n---\n\n# Plan\n\n## Order of work\n\n- [ ] 1. x\n\n## Done\n\n- x\n\n## Revisions\n"
    keyed = repo / "changes" / "REV-971-booking-form"
    keyed.mkdir(parents=True)
    (keyed / "plan.md").write_text(fm % ("REV-971", "REV-971-booking-form", "2026-09-02"))
    (keyed / "facts.md").write_text(fm % ("REV-971", "REV-971-booking-form", "2026-09-02"))
    ticketless = repo / "changes" / "PENDING-guardrail-flag-evasion"
    ticketless.mkdir(parents=True)
    (ticketless / "plan.md").write_text(
        fm % ("pending", "PENDING-guardrail-flag-evasion", "2026-09-03")
    )
    (ticketless / "facts.md").write_text(
        fm % ("pending", "PENDING-guardrail-flag-evasion", "2026-09-03")
    )
    archived = repo / "changes" / "archive" / "2026-09-04-PENDING-hubspot-downloads"
    archived.mkdir(parents=True)
    (archived / "plan.md").write_text(
        (fm % ("pending", "2026-09-04-PENDING-hubspot-downloads", "2026-09-04")).replace(
            "status: approved", "status: approved\narchived_at: 2026-09-04"
        )
    )
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "legacy ids"],
        cwd=repo,
        check=True,
        env=env,
    )

    _adopt(repo)

    kept_key = repo / "changes" / "2026-09-02-REV-971-booking-form"
    now_dated = repo / "changes" / "2026-09-03-guardrail-flag-evasion"
    moved = repo / "changes" / "archive" / "2026" / "2026-09" / "2026-09-04-hubspot-downloads"
    assert kept_key.is_dir() and not keyed.exists()
    assert now_dated.is_dir() and not ticketless.exists()
    assert moved.is_dir() and not archived.exists()
    for name in ("plan.md", "facts.md"):
        assert f"change: {kept_key.name}" in (kept_key / name).read_text()
        assert "linear: REV-971" in (kept_key / name).read_text()
        assert f"change: {now_dated.name}" in (now_dated / name).read_text()
        assert "linear: none" in (now_dated / name).read_text()
    assert "linear: none" in (moved / "plan.md").read_text()
    assert f"change: {moved.name}" in (moved / "plan.md").read_text()
    # An existing change means no adopt-sdlc change is invented on top.
    assert not list((repo / "changes").glob("*-adopt-sdlc"))


def test_claude_false_writes_no_claude_workflows_and_removes_existing_ones(tmp_path: Path) -> None:
    """sdlc.json `claude: false`: the three token-spending workflows are neither written nor
    kept. Flipping back to true writes them again."""
    repo = _repo(tmp_path, "node")
    env = _env()
    assert _adopt(repo).returncode == 0
    wf = repo / ".github" / "workflows"
    assert (wf / "claude-review.yml").exists() and (wf / "ci-triage.yml").exists()
    subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "adopted"],
        cwd=repo,
        check=True,
        env=env,
    )

    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg["claude"] = False
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    out = _sections(_adopt(repo).stdout)
    for name in ("claude-review.yml", "claude.yml", "ci-triage.yml"):
        assert not (wf / name).exists(), name
    assert any("claude-review.yml (removed" in w for w in out["WROTE"])
    assert any("no merge-gate" in m for m in out["MANUAL"]) and not any(
        "ANTHROPIC_API_KEY" in m for m in out["MANUAL"]
    )
    tracked = subprocess.run(
        ["git", "ls-files", ".github/workflows"], cwd=repo, capture_output=True, text=True, env=env
    ).stdout
    assert "claude-review.yml" not in tracked, "git rm, not just unlink"

    cfg["claude"] = True
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    assert _adopt(repo).returncode == 0
    assert (wf / "claude-review.yml").exists()


def _commit(repo: Path, msg: str) -> None:
    env = _env()
    subprocess.run(["git", "add", "-A"], cwd=repo, check=True, env=env)
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", msg],
        cwd=repo,
        check=True,
        env=env,
    )


# What an earlier adopt installed for path-based merge labels, removed on 2026-10-31.
OLD_DEP_MESSAGE = (
    "dependency changes are Ask-tier: a human adds the package in a branch and commits "
    "package.json + the lockfile; the PR gets the ask label. Say which package and why, then stop."
)
OLD_CLAUDE_SENTENCES = (
    "That PR is labelled by blast radius: `ask` needs a human, `show` and `ship` auto-merge on green.",
    "There are no Ship/Show/Ask tiers here, so that PR auto-merges on green too.",
)


def _plant_legacy_tiers(repo: Path, claude_sentence: str) -> None:
    """A repo as an earlier adopt left it: label files, label keys, label wording."""
    gh = repo / ".github"
    (gh / "workflows" / "ship-show-ask.yml").write_text("name: Ship / Show / Ask\n")
    (repo / "scripts" / "ship_show_ask.py").write_text("# classifier\n")
    (gh / "tiers.json").write_text('{"order": ["ask", "show", "ship"]}\n')
    (gh / "CODEOWNERS").write_text(
        "# GENERATED by `run-sdlc adopt` from sdlc.json (codeowners) x .github/tiers.json (ask).\n"
        "/k8s/  @alice\n"
    )
    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg.update(tiers=True, askGatesMerge=True, codeowners=["@alice"], showChannel="C123")
    cfg["blocked"][0]["message"] = OLD_DEP_MESSAGE
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    claude = (repo / "CLAUDE.md").read_text()
    assert MERGE_SENTENCE in claude
    (repo / "CLAUDE.md").write_text(claude.replace(MERGE_SENTENCE, claude_sentence))


@pytest.mark.parametrize("claude_sentence", OLD_CLAUDE_SENTENCES)
def test_removes_the_merge_tier_files_an_earlier_version_installed(
    tmp_path: Path, claude_sentence: str
) -> None:
    repo = _repo(tmp_path, "node")
    assert _adopt(repo).returncode == 0
    _plant_legacy_tiers(repo, claude_sentence)
    _commit(repo, "adopted with merge labels")

    result = _adopt(repo)
    assert result.returncode == 0, result.stderr
    out = _sections(result.stdout)
    for rel in LEGACY_TIER_FILES:
        assert not (repo / rel).exists(), rel
        assert f"{rel} (removed: path-based merge rules are gone from the SDLC)" in out["WROTE"], (
            rel
        )
    assert not (repo / ".github" / "CODEOWNERS").exists()
    tracked = subprocess.run(
        ["git", "ls-files"], cwd=repo, capture_output=True, text=True, env=_env()
    ).stdout.splitlines()
    gone = LEGACY_TIER_FILES + (".github/CODEOWNERS",)
    assert not [rel for rel in gone if rel in tracked], "git rm, not just unlink"
    cfg = json.loads((repo / "sdlc.json").read_text())
    for key in ("tiers", "askGatesMerge", "codeowners", "showChannel"):
        assert key not in cfg, key
    assert cfg["blocked"][0]["message"] == (
        "dependency changes are a human's: a human adds the package in a branch and commits "
        "package.json + the lockfile. Say which package and why, then stop."
    )
    claude = (repo / "CLAUDE.md").read_text()
    assert claude_sentence not in claude and MERGE_SENTENCE in claude
    manual = "\n".join(out["MANUAL"])
    assert "CODE_MANAGER_APP" in manual and "require_code_owner_review=false" in manual
    for rel in ("sdlc.json", "CLAUDE.md", "docs/sdlc.md"):
        hit = TIER_WORDS.search((repo / rel).read_text())
        assert not hit, f"{rel}: still names merge labels ({hit.group(0)!r})"
    # And the next run leaves it alone.
    assert _sections(_adopt(repo).stdout)["WROTE"] == []


def test_keeps_a_hand_written_codeowners_and_kept_tier_files(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "node")
    assert _adopt(repo).returncode == 0
    (repo / ".github" / "CODEOWNERS").write_text("*  @alice\n")
    wf = repo / ".github" / "workflows" / "ship-show-ask.yml"
    wf.write_text("# hand-tuned\n")
    cfg = json.loads((repo / "sdlc.json").read_text())
    cfg["keep"] = [".github/workflows/ship-show-ask.yml"]
    (repo / "sdlc.json").write_text(json.dumps(cfg, indent=2) + "\n")
    out = _sections(_adopt(repo).stdout)
    assert (repo / ".github" / "CODEOWNERS").read_text() == "*  @alice\n"
    assert wf.read_text() == "# hand-tuned\n"
    assert ".github/workflows/ship-show-ask.yml (sdlc.json keep)" in out["KEPT"]


def test_default_branch_comes_from_the_remote_when_origin_head_is_unset(tmp_path: Path) -> None:
    # `gh repo create --push` leaves no refs/remotes/origin/HEAD; only `git clone` sets it.
    repo = _repo(tmp_path, "node")
    env = _env()
    remote = tmp_path / "remote.git"
    subprocess.run(["git", "init", "-q", "--bare", "-b", "main", str(remote)], check=True, env=env)
    subprocess.run(["git", "branch", "-qm", "main"], cwd=repo, check=True, env=env)
    subprocess.run(["git", "remote", "add", "origin", str(remote)], cwd=repo, check=True, env=env)
    subprocess.run(["git", "push", "-q", "origin", "main"], cwd=repo, check=True, env=env)
    assert _adopt(repo, "--preset", "node").returncode == 0
    assert json.loads((repo / "sdlc.json").read_text())["defaultBranch"] == "main"


DECISION_LOG = """---
title: UX decision log
---

# UX decision log

Every answer the owner gives, appended in order.

| Date | Decision | Answer | By whom |
| --- | --- | --- | --- |
| 2026-09-28 | Round-1 A-001: adopt the design system | Accept | Owner |

## 2026-09-29 Owner Survey Answers

Calvin answered all of them.

### DEC-01 · Use HubSpot first

**Replaced on 2026-10-11 by 2026-10-11 LeadHub hosts no signup form (owner):** no form.

- **Question:** who owns signup intake?

### DEC-02 · Who may export leads

- Partner admins.
- One bullet. Replaced by 2026-10-11 LeadHub hosts no signup form (owner): only this bullet.

## 2026-10-11 LeadHub hosts no signup form (owner)

HubSpot is the only signup.

## 2026-10-12 Settled by Claude: rows keep their hover

Superseded by IG-3**: nobody can resolve this one.
"""


def test_splits_an_appended_decision_log_into_one_file_per_decision(tmp_path: Path) -> None:
    """`cct:ux-decision` appended every answer to one log: 2,910 lines in omr-leadhub on
    2026-10-20, read whole for one answer. adopt splits it into one ADR per decision, links
    what replaced what, writes the index, and leaves a pointer that a second run ignores."""
    repo = _repo(tmp_path, "node")
    (repo / "docs" / "ux").mkdir(parents=True)
    (repo / "docs" / "ux" / "decisions.md").write_text(DECISION_LOG)
    nested = repo / "docs" / "designs" / "2026" / "2026-09"
    nested.mkdir(parents=True)
    (nested / "2026-09-01-spec-old.md").write_text("---\ntitle: Old spec\nstatus: shipped\n---\n")
    out = _sections(_adopt(repo).stdout)

    designs = repo / "docs" / "designs"
    files = {p.stem: p.read_text() for p in designs.rglob("*-adr-*.md")}
    assert sorted(files) == [
        "2026-09-28-adr-round-1-a-001",
        "2026-09-29-adr-dec-01-use-hubspot-first",
        "2026-09-29-adr-dec-02-who-may-export-leads",
        "2026-10-11-adr-leadhub-hosts-no-signup-form-owner",
        "2026-10-12-adr-settled-by-claude-rows-keep-their",
    ]
    # The designs folder already nests by year-month, so the new files do too.
    assert (
        designs / "2026" / "2026-10" / "2026-10-11-adr-leadhub-hosts-no-signup-form-owner.md"
    ).is_file()
    dec01 = files["2026-09-29-adr-dec-01-use-hubspot-first"]
    assert "status: superseded" in dec01
    assert "superseded_by: [2026-10-11-adr-leadhub-hosts-no-signup-form-owner]" in dec01
    assert "Calvin answered all of them." in dec01, "the round's lead travels with each child"
    # A replacement inside one bullet amends the decision; the rest of it still holds.
    dec02 = files["2026-09-29-adr-dec-02-who-may-export-leads"]
    assert "status: accepted" in dec02
    assert "amended_by: [2026-10-11-adr-leadhub-hosts-no-signup-form-owner]" in dec02
    new = files["2026-10-11-adr-leadhub-hosts-no-signup-form-owner"]
    assert "decided_by: owner" in new
    assert "2026-09-29-adr-dec-01-use-hubspot-first" in new and "2026-09-29-adr-dec-02" in new
    assert "decided_by: claude" in files["2026-10-12-adr-settled-by-claude-rows-keep-their"]
    assert any("link by hand" in m and "IG-3" in m for m in out["MANUAL"])

    index = (designs / "INDEX.md").read_text()
    assert "[Old spec](2026/2026-09/2026-09-01-spec-old.md) · shipped" in index
    replaced = index.split("## Replaced")[1]
    assert "DEC-01" in replaced and "DEC-02" not in replaced
    log = (repo / "docs" / "ux" / "decisions.md").read_text()
    assert "(moved)" in log and "## " not in log

    # Idempotent: the pointer holds no decisions, so nothing moves twice.
    assert _sections(_adopt(repo).stdout)["WROTE"] == []


def test_adopt_copies_marks_script_verbatim(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "python")
    assert _adopt(repo).returncode == 0
    source = ADOPT.parents[1] / "templates/scripts/marks.py"
    assert (repo / "scripts/marks.py").read_bytes() == source.read_bytes()


def test_template_tests_commit_with_an_identity() -> None:
    """2026-10-27: a guardrail test ran `git commit` with no identity and failed on every CI
    runner of every repo refreshed to that kit, while passing on every laptop."""
    tests = SCRIPTS.parent / "templates" / "tests"
    bare = [
        f"{path.name}:{n}"
        for path in sorted(tests.glob("*"))
        if path.is_file()
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1)
        if re.search(r"[\"']commit[\"']|\bcommit -q", line) and "user.email" not in line
    ]
    assert not bare, f"git commit without -c user.name/-c user.email: {bare}"
