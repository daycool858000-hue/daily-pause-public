#!/usr/bin/env python3
"""Independently restore the published GitHub commit ZIP and verify every file."""
from __future__ import annotations

import functools
import hashlib
import http.server
import json
import os
import pathlib
import re
import shutil
import subprocess
import tempfile
import threading
import urllib.request
import zipfile


def digest(p: pathlib.Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def enumerate_files(root: pathlib.Path) -> dict[str, str]:
    result = {}
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(root)
        if ".git" in rel.parts or rel.name == "restore-summary.json":
            continue
        result[rel.as_posix()] = digest(p)
    return result


def download_zip(repo: str, sha: str, destination: pathlib.Path) -> None:
    sources = [
        "https://codeload.github.com/" + repo + "/zip/" + sha,
        "https://api.github.com/repos/" + repo + "/zipball/" + sha,
    ]
    last_error = None
    for url in sources:
        try:
            headers = {"User-Agent": "daily-pause-independent-archive-check"}
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=120) as inp, destination.open("wb") as out:
                shutil.copyfileobj(inp, out)
            if not zipfile.is_zipfile(destination):
                raise RuntimeError("not a real ZIP archive")
            return
        except Exception as exc:
            last_error = str(exc)
    raise RuntimeError("Unable to download independent GitHub archive: " + str(last_error))


def restore_zip(src: pathlib.Path, extraction: pathlib.Path) -> pathlib.Path:
    with zipfile.ZipFile(src) as archive:
        members = archive.namelist()
        if not members:
            raise AssertionError("empty backup ZIP")
        for member in members:
            parts = pathlib.PurePosixPath(member).parts
            if pathlib.PurePosixPath(member).is_absolute() or ".." in parts:
                raise AssertionError("ZIP path traversal: " + member)
        archive.extractall(extraction)
    roots = [p for p in extraction.iterdir() if p.is_dir()]
    if len(roots) != 1:
        raise AssertionError("ZIP should contain exactly one project root directory")
    return roots[0]


def http_smoke(restored: pathlib.Path) -> int:
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    handler = functools.partial(QuietHandler, directory=str(restored))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        html = (restored / "index.html").read_text(encoding="utf-8")
        scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)
        css = re.findall(r'<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"', html)
        assets = [p.relative_to(restored).as_posix() for p in (restored / "media").rglob("*") if p.is_file()]
        urls = ["/", "/index.html"] + scripts + css + assets
        tested = 0
        for item in urls:
            path = item if item.startswith("/") else "/" + item.removeprefix("./")
            with urllib.request.urlopen("http://127.0.0.1:" + str(server.server_port) + path, timeout=15) as res:
                body = res.read()
                if res.status != 200 or not body:
                    raise AssertionError("site asset fails HTTP smoke check: " + item)
            tested += 1
        return tested
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=10)


def main() -> None:
    repo = os.environ.get("GITHUB_REPOSITORY", "daycool858000-hue/daily-pause-public")
    sha = os.environ.get("GITHUB_SHA", "").strip()
    if not re.fullmatch("[0-9a-f]{40}", sha):
        raise SystemExit("GITHUB_SHA must be a complete 40-character commit ID")
    checkout = pathlib.Path.cwd().resolve()
    with tempfile.TemporaryDirectory(prefix="daily-pause-restore-") as tmp:
        scratch = pathlib.Path(tmp)
        zip_path = scratch / "commit-backup.zip"
        download_zip(repo, sha, zip_path)
        backup_sha256 = digest(zip_path)
        archive_root = restore_zip(zip_path, scratch / "extracted")
        restored = scratch / "restored"
        shutil.copytree(archive_root, restored)
        original_files = enumerate_files(checkout)
        restored_files = enumerate_files(restored)
        if original_files != restored_files:
            extra = set(restored_files) - set(original_files)
            missing = set(original_files) - set(restored_files)
            corrupt = [p for p in original_files.keys() & restored_files.keys()
                       if original_files[p] != restored_files[p]]
            raise AssertionError("archive mismatch: extra=" + str(sorted(extra)) +
                                 "; missing=" + str(sorted(missing)) +
                                 "; modified=" + str(sorted(corrupt)))
        completed = subprocess.run(["node", "scripts/site-audit.mjs", str(restored)],
                                   cwd=restored, text=True, capture_output=True, timeout=90)
        print(completed.stdout, flush=True)
        if completed.returncode:
            raise RuntimeError("Restored site test failed: " + completed.stderr)
        simulated = subprocess.run(["node", "scripts/locker-audit.mjs", str(restored)],
                                   cwd=restored, text=True, capture_output=True, timeout=90)
        print(simulated.stdout, flush=True)
        if simulated.returncode:
            raise RuntimeError("Restored locker test failed: " + simulated.stderr)
        smoke = http_smoke(restored)
        info = {
            "status": "PASS", "tested_commit": sha, "repository": repo,
            "backup_sha256": backup_sha256, "restored_file_count": len(restored_files),
            "media_file_count": len([p for p in restored_files if p.startswith("media/")]),
            "sha256_identical_to_checkout": True,
            "node_content_check": "PASS", "locker_storage_simulation": "PASS",
            "http_smoke_requests": smoke,
            "external_device_test": "NOT PERFORMED; user reported phone and desktop testing",
            "locker_manual_save_retrieve": "NOT PERFORMED",
        }
        pathlib.Path("restore-summary.json").write_text(
            json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps(info, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
