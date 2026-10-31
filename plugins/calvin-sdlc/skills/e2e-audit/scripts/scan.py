#!/usr/bin/env python3
"""Usage: python3 scan.py <repo-root>
Counts Playwright anti-patterns and locator signals in a repo's spec files. Read-only, stdlib only.
Spec files: *.spec.ts, *.spec.js, *.test.ts under an e2e, tests, test or playwright directory;
node_modules and build output are skipped. Comment-only lines are ignored.
Output sections: -#-#- SUMMARY -#-#- (- key: value rows),
-#-#- BEGIN SAMPLES -#-#- ... -#-#- END SAMPLES -#-#- (up to 5 file:line samples per pattern).
Exit codes: 0 always, 2 on a bad path.
"""

import re
import sys
from pathlib import Path

SKIP_DIRS = {
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "playwright-report",
    "test-results",
}
SPEC_DIRS = {"e2e", "tests", "test", "playwright"}
SPEC_NAME = re.compile(r"\.(spec\.(ts|js)|test\.ts)$")
MAX_SAMPLES = 5

# CSS-looking: class, id, attribute, combinator or pseudo selector (not text=/role=/xpath=)
CSS_LOCATOR = re.compile(
    r"""\.locator\(\s*['"`](?!text=|role=|xpath=|//)([^'"`]*[.#\[>:][^'"`]*)['"`]"""
)
PATTERNS = {
    "waitForTimeout": re.compile(r"\bwaitForTimeout\("),
    "networkidle": re.compile(r"networkidle"),
    "nth": re.compile(r"\.nth\("),
    "first_last": re.compile(r"\.(first|last)\(\)"),
    "css_locator": CSS_LOCATOR,
    "getByTestId": re.compile(r"\bgetByTestId\("),
    "getByRole": re.compile(r"\bgetByRole\("),
    "getByText_literal": re.compile(r"""\bgetByText\(\s*['"`]"""),
    "expect_await": re.compile(r"\bexpect\(\s*await\b"),
    "force_true": re.compile(r"\bforce:\s*true"),
    "skip_fixme": re.compile(r"\btest\.(skip|fixme)\b"),
}
TEST_START = re.compile(r"\btest\(")
CONDITIONAL = re.compile(r"\bif\s*\(|\s\?\s.+\s:\s")
DATE = re.compile(r"\bDate\.now\(|\bnew Date\(")
ORDER = [*PATTERNS, "conditional_in_test", "date_without_clock"]


def spec_files(root: Path):
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root)
        if (
            SKIP_DIRS & set(rel.parts)
            or not path.is_file()
            or not SPEC_NAME.search(path.name)
        ):
            continue
        if SPEC_DIRS & set(rel.parts[:-1]):
            yield path, rel


def scan(root: Path):
    counts = dict.fromkeys(ORDER, 0)
    samples: dict[str, list[str]] = {k: [] for k in ORDER}
    tests = specs = 0

    def hit(key: str, rel: Path, n: int, line: str) -> None:
        counts[key] += 1
        if len(samples[key]) < MAX_SAMPLES:
            samples[key].append(f"{rel}:{n}: {line.strip()[:100]}")

    for path, rel in spec_files(root):
        specs += 1
        text = path.read_text(errors="replace")
        uses_clock = "page.clock" in text
        in_tests = (
            False  # shortcut: everything after the first test( counts as a test body
        )
        for n, line in enumerate(text.splitlines(), 1):
            if line.lstrip().startswith(("//", "*", "/*")):
                continue
            if TEST_START.search(line):
                tests += 1
                in_tests = True
            for key, rx in PATTERNS.items():
                if rx.search(line):
                    hit(key, rel, n, line)
            if in_tests and CONDITIONAL.search(line):
                hit("conditional_in_test", rel, n, line)
            if not uses_clock and DATE.search(line):
                hit("date_without_clock", rel, n, line)
    return specs, tests, counts, samples


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if root is None or not root.is_dir():
        print("usage: python3 scan.py <repo-root>", file=sys.stderr)
        return 2
    specs, tests, counts, samples = scan(root)
    print("-#-#- SUMMARY -#-#-")
    print(f"- spec_files: {specs}")
    print(f"- tests: {tests}")
    for key in ORDER:
        print(f"- {key}: {counts[key]}")
    print("-#-#- BEGIN SAMPLES -#-#-")
    for key in ORDER:
        for sample in samples[key]:
            print(f"- {key}: {sample}")
    print("-#-#- END SAMPLES -#-#-")
    return 0


if __name__ == "__main__":
    sys.exit(main())
