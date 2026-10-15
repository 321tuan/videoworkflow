#!/usr/bin/env python3
import json
import sys
from pathlib import Path

VALID_STATUS = {"verified", "user-provided", "inferred", "unverified"}
VALID_VISUAL = {"V1", "V2", "V3", "V4", "V5", "V6"}


def word_count(text):
    return len(str(text or "").strip().split())


def validate(data):
    errors = []
    warnings = []

    required = ["version", "title", "target_duration_sec", "core_proposition", "beats"]
    for key in required:
        if key not in data:
            errors.append(f"missing required field: {key}")

    duration = data.get("target_duration_sec")
    if not isinstance(duration, (int, float)) or duration <= 0:
        errors.append("target_duration_sec must be a positive number")

    claims = data.get("claims", [])
    if not isinstance(claims, list):
        errors.append("claims must be a list")
    else:
        for i, claim in enumerate(claims):
            status = claim.get("status") if isinstance(claim, dict) else None
            if status not in VALID_STATUS:
                errors.append(f"claims[{i}].status must be one of {sorted(VALID_STATUS)}")
            if status in {"inferred", "unverified"} and claim.get("source"):
                warnings.append(f"claims[{i}] is {status} but has a source; confirm classification")

    beats = data.get("beats")
    if not isinstance(beats, list) or not beats:
        errors.append("beats must be a non-empty list")
        return errors, warnings

    ids = set()
    last_end = None
    for i, beat in enumerate(beats):
        if not isinstance(beat, dict):
            errors.append(f"beats[{i}] must be an object")
            continue

        bid = beat.get("id")
        if not isinstance(bid, int):
            errors.append(f"beats[{i}].id must be an integer")
        elif bid in ids:
            errors.append(f"duplicate beat id: {bid}")
        else:
            ids.add(bid)

        start = beat.get("start_sec")
        end = beat.get("end_sec")
        if not isinstance(start, (int, float)) or not isinstance(end, (int, float)):
            errors.append(f"beats[{i}] start_sec/end_sec must be numbers")
        elif start >= end:
            errors.append(f"beats[{i}] must have start_sec < end_sec")
        else:
            if last_end is not None and start < last_end:
                errors.append(f"beats[{i}] overlaps previous beat")
            last_end = end

        vt = beat.get("visual_type")
        if vt not in VALID_VISUAL:
            errors.append(f"beats[{i}].visual_type must be one of {sorted(VALID_VISUAL)}")

        hero = beat.get("hero_text", "")
        if word_count(hero) > 8:
            warnings.append(f"beats[{i}].hero_text exceeds 8 words")

    first_start = beats[0].get("start_sec") if isinstance(beats[0], dict) else None
    if isinstance(first_start, (int, float)) and first_start != 0:
        warnings.append("first beat does not start at 0 seconds")

    if isinstance(duration, (int, float)) and isinstance(last_end, (int, float)):
        if abs(last_end - duration) > max(2, duration * 0.1):
            warnings.append("final beat end differs materially from target_duration_sec")

    return errors, warnings


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_video_plan.py <video-plan.json>")
        sys.exit(2)

    path = Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: could not read JSON: {exc}")
        sys.exit(1)

    errors, warnings = validate(data)
    for item in warnings:
        print(f"WARNING: {item}")
    for item in errors:
        print(f"ERROR: {item}")

    if errors:
        sys.exit(1)

    print("OK: video plan passed validation")


if __name__ == "__main__":
    main()
