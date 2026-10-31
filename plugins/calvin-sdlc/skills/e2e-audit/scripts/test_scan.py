"""Tests for scan.py against the fixture suite in fixtures/."""

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
SCAN = HERE / "scan.py"
FIXTURES = HERE / "fixtures"


def run(path: Path):
    return subprocess.run(
        [sys.executable, str(SCAN), str(path)],
        capture_output=True,
        text=True,
        check=False,
    )


def summary(out: str) -> dict[str, int]:
    block = out.split("-#-#- SUMMARY -#-#-\n")[1].split("-#-#- BEGIN SAMPLES")[0]
    return {k: int(v) for k, v in (r[2:].split(": ") for r in block.splitlines())}


def test_counts_and_format():
    r = run(FIXTURES)
    assert r.returncode == 0
    assert r.stdout.index("-#-#- SUMMARY -#-#-") < r.stdout.index(
        "-#-#- BEGIN SAMPLES -#-#-"
    )
    assert r.stdout.rstrip().endswith("-#-#- END SAMPLES -#-#-")
    assert summary(r.stdout) == {
        "spec_files": 3,
        "tests": 3,
        "waitForTimeout": 1,
        "networkidle": 1,
        "nth": 1,
        "first_last": 2,
        "css_locator": 1,
        "getByTestId": 3,
        "getByRole": 3,
        "getByText_literal": 1,
        "expect_await": 1,
        "force_true": 1,
        "skip_fixme": 1,
        "conditional_in_test": 1,
        "date_without_clock": 2,
    }
    assert "- waitForTimeout: e2e/a.spec.ts:4:" in r.stdout


def test_samples_capped_at_five(tmp_path):
    (tmp_path / "e2e").mkdir()
    body = "".join(f"  await page.waitForTimeout({i})\n" for i in range(8))
    (tmp_path / "e2e" / "x.spec.ts").write_text(
        f"test('x', async () => {{\n{body}}})\n"
    )
    r = run(tmp_path)
    assert summary(r.stdout)["waitForTimeout"] == 8
    assert r.stdout.count("- waitForTimeout: e2e/x.spec.ts:") == 5


def test_skips_node_modules(tmp_path):
    d = tmp_path / "e2e" / "node_modules" / "pkg"
    d.mkdir(parents=True)
    (d / "y.spec.ts").write_text("test('y', () => {})\n")
    assert summary(run(tmp_path).stdout)["spec_files"] == 0


def test_bad_path_exits_2(tmp_path):
    assert run(tmp_path / "missing").returncode == 2
