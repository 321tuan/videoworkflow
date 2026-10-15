# video-plan.json Schema

Use this machine-readable structure when the user wants automation, code generation, or a repeatable rendering pipeline.

```json
{
  "version": "1.0",
  "title": "string",
  "platform": "tiktok|reels|shorts|other",
  "aspect_ratio": "9:16",
  "target_duration_sec": 35,
  "audience": "string",
  "core_proposition": "string",
  "cta": "string",
  "claims": [
    {
      "claim": "string",
      "status": "verified|user-provided|inferred|unverified",
      "source": "string or null"
    }
  ],
  "beats": [
    {
      "id": 1,
      "start_sec": 0,
      "end_sec": 3,
      "function": "Hook",
      "voice": "string",
      "subtitle": "string",
      "hero_text": "string",
      "visual_type": "V1|V2|V3|V4|V5|V6",
      "visual_direction": "string",
      "asset": "string",
      "perceptual_event": "string"
    }
  ],
  "assets": [
    {
      "id": "string",
      "priority": 1,
      "need": "string",
      "source": "string or null",
      "status": "available|missing|to-create|to-source"
    }
  ],
  "qa": {
    "warnings": ["string"],
    "passed": true
  }
}
```

Constraints:

- `target_duration_sec` must be positive.
- At least one beat is required.
- Beat IDs must be unique integers.
- Each beat must have `start_sec < end_sec`.
- Beats must be ordered by start time and must not overlap.
- First beat should normally start at 0.
- Final beat should end close to the target duration.
- `hero_text` should normally be <=8 words.
- `visual_type` must be one of V1-V6.
- Claims marked inferred/unverified must not be converted into precise marketing proof.
