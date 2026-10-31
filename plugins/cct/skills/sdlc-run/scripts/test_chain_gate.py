"""chain-gate.sh, the milestone-process rules: building only inside /goal, and the criteria
locked once the engineer approved. The transcript fixtures pin the undocumented goal_status
entry; if Claude Code changes its shape, these tests are where it shows."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest

HOOKS = Path(__file__).resolve().parents[1] / "templates" / "hooks"
ID = "2026-10-09-trial"
PLAN = "---\nstatus: approved\n---\n\n## Goal handover\n\nDeliver feature 1 of change trial.\n"


def _goal(met: bool, sentinel: bool = False) -> dict:
    att = {"type": "goal_status", "met": met, "condition": "Deliver feature 1 of change"}
    if sentinel:
        att["sentinel"] = True
    return {"type": "attachment", "attachment": att}


TRANSCRIPTS = {
    "active": [{"type": "user"}, _goal(False, sentinel=True)],
    "evaluated-not-met": [_goal(False, sentinel=True), {"type": "assistant"}, _goal(False)],
    "met": [_goal(False, sentinel=True), _goal(True)],
    "none": [{"type": "user"}, {"type": "assistant"}],
}


@pytest.fixture
def repo(tmp_path: Path) -> Path:
    repo = tmp_path / "repo"
    (repo / ".claude" / "hooks").mkdir(parents=True)
    for name in ("chain-gate.sh", "sdlc-config.sh"):
        shutil.copy(HOOKS / name, repo / ".claude" / "hooks" / name)
    (repo / "sdlc.json").write_text(json.dumps({"changesDir": "changes"}))
    change = repo / "changes" / ID
    change.mkdir(parents=True)
    (change / "decisions.json").write_text(
        json.dumps(
            {"size": "M", "kind": "feature", "milestone": {"kind": "single", "slug": "trial"}}
        )
    )
    (change / "intent.md").write_text("---\nstatus: approved\n---\n")
    (change / "facts.md").write_text("---\nstatus: approved\n---\n")
    (change / "plan.md").write_text(PLAN)
    (change / "lock.json").write_text("{}\n")
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    subprocess.run(["git", "init", "-q", "-b", "feat/trial"], cwd=repo, check=True, env=env)
    return repo


def _edit(repo: Path, file: str, transcript: str | None) -> subprocess.CompletedProcess[str]:
    path = ""
    if transcript is not None:
        t = repo.parent / f"{transcript}.jsonl"
        if transcript in TRANSCRIPTS:
            t.write_text("".join(json.dumps(e) + "\n" for e in TRANSCRIPTS[transcript]))
        path = str(t)
    payload = {"tool_input": {"file_path": file}, "transcript_path": path}
    return subprocess.run(
        ["bash", str(repo / ".claude" / "hooks" / "chain-gate.sh")],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        env={**os.environ, "CLAUDE_PROJECT_DIR": str(repo)},
    )


@pytest.mark.parametrize("transcript", ["active", "evaluated-not-met"])
def test_source_edit_inside_an_active_goal_is_allowed(repo: Path, transcript: str) -> None:
    assert _edit(repo, "src/app.ts", transcript).returncode == 0


@pytest.mark.parametrize("transcript", ["none", "met"])
def test_source_edit_without_an_active_goal_is_refused(repo: Path, transcript: str) -> None:
    r = _edit(repo, "src/app.ts", transcript)
    assert r.returncode == 2 and "inside /goal" in r.stderr


def test_unreadable_transcript_fails_open_with_a_warning(repo: Path) -> None:
    r = _edit(repo, "src/app.ts", "missing")
    assert r.returncode == 0 and "transcript unreadable" in r.stderr


def test_source_edit_before_the_lock_is_refused(repo: Path) -> None:
    (repo / "changes" / ID / "lock.json").unlink()
    r = _edit(repo, "src/app.ts", "active")
    assert r.returncode == 2 and "verify_gate.py approve" in r.stderr


@pytest.mark.parametrize("file", [f"changes/{ID}/facts.md", f"changes/{ID}/done.json", "sdlc.json"])
def test_protected_paths_are_refused_after_approval(repo: Path, file: str) -> None:
    r = _edit(repo, file, "active")
    assert r.returncode == 2 and "protectedEdit" in r.stderr
    decisions = repo / "changes" / ID / "decisions.json"
    d = json.loads(decisions.read_text())
    d["protectedEdit"] = "2026-10-09 engineer: 'F3 was wrong, change it'"
    decisions.write_text(json.dumps(d))
    assert _edit(repo, file, "active").returncode == 0


def test_facts_wait_for_the_confirmed_intent(repo: Path) -> None:
    (repo / "changes" / ID / "intent.md").write_text("---\nstatus: draft\n---\n")
    (repo / "changes" / ID / "lock.json").unlink()
    r = _edit(repo, f"changes/{ID}/facts.md", "active")
    assert r.returncode == 2 and "intent.md is not approved" in r.stderr


def test_a_v3_folder_without_milestone_keeps_its_rules(repo: Path) -> None:
    change = repo / "changes" / ID
    (change / "decisions.json").write_text(json.dumps({"size": "M", "kind": "feature"}))
    (change / "plan.md").write_text("---\nstatus: approved\n---\n\n## Goal handover\n\n/goal x\n")
    assert _edit(repo, "src/app.ts", "none").returncode == 0
