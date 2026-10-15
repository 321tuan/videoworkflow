---
name: shortform-video-workflow
description: Build high-retention short-form video concepts and production briefs from a topic, source, product, or brand context. Use for TikTok, Reels, Shorts, vertical educational/promotional videos, or when turning long material into concise video scripts. Produces a fact-checked core proposition, multiple hooks, retention-focused script, voice/subtitle/hero-text layers, narrative beats, visual and asset plan, CTA, and QA checks. Prioritizes real evidence and brand-owned assets, avoids fabricated marketing claims, and supports repeatable production workflows rather than one-off copywriting.
---

# Short-form Video Workflow

Use this skill as a production system, not merely a script writer. Optimize for attention, comprehension, evidence, visualizability, brand fit, and repeatability.

## Core principles

1. Keep one core proposition per video.
2. Start with a reason to care, not background exposition.
3. Prefer concrete mechanisms and observable examples over slogans.
4. Separate voice-over, subtitles, and hero text; do not duplicate the full narration on screen.
5. Treat proof, product UI, source screenshots, and brand-owned assets as stronger than generic stock.
6. Create narrative beats, not one scene per sentence.
7. Introduce meaningful perceptual change roughly every 2-4 seconds without adding random motion.
8. Never fabricate statistics, testimonials, user results, rankings, or quoted claims.
9. Make the hook earn its payoff. Reject clickbait the body does not resolve.
10. Optimize for a repeatable workflow. Reuse components, templates, and analytics learnings.

## Inputs

Work from whatever the user provides. Useful inputs include:

- topic, source text, URL, document, transcript, or existing video
- target audience and platform
- brand/product context and CTA
- brand-owned assets or product UI
- desired length or content type
- verified metrics, testimonials, results, or evidence

If only a topic is provided, proceed with reasonable defaults and state material assumptions. Ask only when a missing detail blocks a correct or safe result.

Default assumptions unless the request says otherwise:

- format: 9:16 vertical
- default length: 25-45 seconds
- one main CTA
- hero text: at most 8 words per beat
- subtitles: at most 2 lines at a time
- product/proof appears before ~15 seconds when naturally relevant

## Workflow

### 1. Establish the evidence base

When the video depends on factual claims, current facts, statistics, policies, product specs, or external sources:

- retrieve or inspect the source before writing the persuasive script when tools allow;
- extract claims into a fact sheet;
- label every important claim as `verified`, `user-provided`, `inferred`, or `unverified`;
- do not turn `inferred` or `unverified` claims into precise numbers, testimonials, rankings, or outcomes;
- preserve source links or citations in the production brief when available.

For purely creative or opinion-led videos, skip heavy research but still avoid invented factual proof.

### 2. Atomize the source

If the source contains multiple ideas, split it into candidate video ideas. Do not compress an entire long article, report, lesson, or product overview into one short by default.

For each candidate, identify:

- audience pain or desire
- specific insight or result
- novelty or contrast
- available evidence
- visual potential
- natural product/brand fit
- actionable takeaway

Select one core proposition for the current video.

### 3. Score the topic

Use a lightweight 0-5 diagnostic for:

- relevance
- pain/desire intensity
- novelty
- specificity
- proof strength
- visual potential
- actionability
- product/brand fit

Do not present the numeric score as an objective truth. Use it to expose weak dimensions and improve packaging.

### 4. Generate hooks before writing the body

Create 8-12 materially different hooks across multiple types:

- pain
- contrarian
- specific/result
- curiosity
- question
- mistake/failure
- proof-led
- demonstration-led

Prefer hooks that are specific and visually expressible. Avoid vague openings such as "Today we will talk about...".

Choose a default hook based on fit with the evidence and body, not maximum sensationalism.

### 5. Write the information-first script

Draft a compact version that is correct before optimizing for retention. It should answer:

- What is the problem or opportunity?
- What is the key mechanism or explanation?
- What proof/example supports it?
- What should the viewer understand or do next?

Cut any background that is not necessary to understand the proposition.

### 6. Rewrite for retention

Restructure into a sequence such as:

`Hook -> open loop -> proof/context -> mechanism -> payoff/benefit -> CTA`

Adapt the order when the topic calls for it. Maintain an unresolved question or tension only as long as needed to carry attention to the payoff.

Use short spoken sentences. Prefer concrete wording:

- weak: "Optimize your learning process."
- stronger: "You missed six SQL questions, so practice SQL next."

### 7. Convert the script into narrative beats

A beat is a meaningful unit of thought, not a sentence boundary. Use roughly 3-7 beats for a 25-45 second video.

Assign each beat one primary function:

- Hook
- Context
- Proof
- Explain
- Escalate
- Reveal
- Benefit
- Payoff
- CTA

Delete or merge beats with no clear function.

### 8. Split every beat into three text layers

For each beat produce:

- **VOICE**: complete spoken meaning.
- **SUBTITLE**: readable chunk aligned to speech; normally <=2 lines.
- **HERO TEXT**: only the phrase that deserves visual emphasis; normally <=8 words.

Do not paste the full voice-over into hero text.

### 9. Choose a visual function

Classify each beat using one primary visual type:

- `V1 Hero typography` - hook, number, contradiction, key claim
- `V2 Real-world B-roll` - context, emotion, attention reset
- `V3 Product/UI proof` - real interface, workflow, result, demonstration
- `V4 Conceptual motion graphic` - abstract/technical explanation
- `V5 Evidence` - source screenshot, chart, metric, document, testimonial
- `V6 Transition/decorative` - connective motion only

Avoid more than two consecutive beats with the same visual grammar unless the internal motion changes meaningfully.

### 10. Select assets by priority

Prefer assets in this order when relevant:

1. brand-owned product UI, real footage, or first-party assets
2. evidence/source screenshots or data
3. semantically exact external footage/images
4. custom motion graphics or diagrams
5. generated imagery
6. generic stock

Do not use an attractive but weakly relevant asset when a less flashy exact asset exists.

For each asset, assess:

- semantic relevance
- brand relevance
- visual quality
- motion/crop potential
- provenance/rights risk where relevant

### 11. Design pacing

Use meaningful perceptual events instead of arbitrary cuts. Examples:

- new object or card
- crop or camera push
- text reveal
- keyword emphasis
- evidence swap
- UI state change
- graph progression
- scene cut

Target approximately one meaningful perceptual event every 2-4 seconds for the default 25-45 second format. Slow down when comprehension requires it.

Do not use constant zooms, shakes, or transitions merely to simulate energy.

### 12. Integrate product and brand naturally

When a product is relevant, demonstrate it as the mechanism rather than pausing for an advertisement.

Prefer:

`problem -> real UI solving the problem -> outcome`

over:

`problem -> generic explanation -> "our platform has feature X"`

Keep direct brand outro/CTA concise, normally 2-4 seconds.

### 13. Build the production brief

Use the output structure in `references/output-schema.md`. When the user wants a machine-readable plan or an implementation pipeline, also produce `video-plan.json` using `references/video-plan-schema.md`.

### 14. Run QA

Apply `references/qa-checklist.md` before finalizing.

If a machine-readable `video-plan.json` was created, run:

`python scripts/validate_video_plan.py video-plan.json`

Fix validation errors before presenting it as production-ready.

## Length tiers

Use duration as a consequence of the idea, not an arbitrary target:

- 15-25s: one fact, one tip, one reveal, or quick demo
- 25-45s: default explanatory/promotional short
- 45-70s: mechanism-heavy explanation that needs additional context
- >70s: use only when the material genuinely justifies it; otherwise atomize into a series

## Existing-video comparison mode

When the user supplies an existing video or transcript and asks to improve it:

1. Extract its core proposition, hook, beat structure, visual grammar, proof, CTA, and pacing.
2. Identify where it behaves like a presentation rather than an attention sequence.
3. Preserve distinctive brand strengths instead of blindly copying a reference channel.
4. Propose the smallest high-impact workflow changes first.
5. If another reference video/channel is provided, compare transferable mechanisms, not superficial style.

## Analytics feedback loop

When performance data is available, log at minimum:

- topic
- hook type
- duration
- script length
- visual types
- CTA
- 3-second hold/retention if available
- average watch time
- completion rate
- shares/saves/comments
- click-through or conversion metric when relevant

Use performance data to update future hypotheses. Do not infer causality from a single video. For A/B tests, change one major variable at a time where practical.

## Boundaries

- Do not claim a style or workflow guarantees virality.
- Do not fabricate or exaggerate proof to strengthen a hook.
- Do not imitate a creator's exact protected visual identity when the goal can be achieved with general techniques.
- Do not force generic stock into every beat.
- Do not render or edit media unless the user asks and the runtime has suitable tools; the default deliverable is a production-ready brief and plan.
