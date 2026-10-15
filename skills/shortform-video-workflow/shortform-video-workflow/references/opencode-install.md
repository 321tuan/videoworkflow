# Install and Share with OpenCode

OpenCode discovers project skills at:

`.opencode/skills/<skill-name>/SKILL.md`

and global skills at:

`~/.config/opencode/skills/<skill-name>/SKILL.md`

To install this skill for one project, unzip/copy the `shortform-video-workflow` directory to:

`.opencode/skills/shortform-video-workflow/`

To make it available globally, copy the same directory to:

`~/.config/opencode/skills/shortform-video-workflow/`

OpenCode can then discover the skill by its description and load it on demand. A user can also explicitly ask:

`Use the shortform-video-workflow skill to turn this source into a 35-second Reel production brief.`

Suggested usage prompts:

- `Turn this article into three short-form video candidates, then fully brief the strongest one.`
- `Analyze this existing short video against the workflow and rewrite its production brief.`
- `Create a 30-second educational Reel from this topic. Do not invent statistics.`
- `Use our product screenshots first; only suggest stock when no exact asset exists.`
- `Generate a video-plan.json I can feed into my rendering pipeline.`

No connector is required by the skill itself. Research, browsing, asset search, media inspection, or rendering depend on whichever tools the user's OpenCode runtime exposes.
