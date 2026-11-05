"""Emit credential field locations and shape checks, never secret values."""
import base64
import json
import re
import subprocess
from pathlib import Path

tracked = subprocess.check_output(["git", "ls-files", "-z"]).decode().split("\0")
results = []
for name in tracked:
    if not name or not (
        name.startswith("app/Remnawave/Config/")
        or name.startswith("docker/remnawave/.env")
    ):
        continue
    for number, line in enumerate(Path(name).read_text().splitlines(), 1):
        key = re.search(r'"(privateKey|password)"\s*:\s*"([^\"]*)"', line)
        if key:
            item = {"file": name, "line": number, "field": key[1], "nonempty": bool(key[2])}
            if key[1] == "privateKey":
                try:
                    item["decodes_to_32_bytes"] = len(base64.urlsafe_b64decode(key[2] + "=" * (-len(key[2]) % 4))) == 32
                except ValueError:
                    item["decodes_to_32_bytes"] = False
            results.append(item)
        if "=" not in line or line.lstrip().startswith("#"):
            continue
        field, value = line.split("=", 1)
        if any(word in field.upper() for word in ["SECRET", "TOKEN", "PASSWORD", "API_KEY"]):
            results.append({"file": name, "line": number, "field": field,
                            "nonempty": bool(value.strip()),
                            "has_template_marker": any(marker in value.lower() for marker in ["example", "change", "replace", "${", "<", "your"])})
Path(__file__).with_suffix(".json").write_text(json.dumps(results, indent=2) + "\n")
print(json.dumps({"credential_fields": len(results), "values_emitted": False}))
