# Recommended Next Build

Generated: 2026-10-20T07:33:09.910Z

## Connect 4  (`connect-4`)

**Opportunity score:** 79.7 / 100

### Why build it
- Reuses the existing board-game engine
- Low implementation cost
- Strong topic-cluster potential
- Deterministic algorithm solves this exactly (AI adds nothing)

### Why incumbents are weak
- matchmaking when both players are on one couch
- ads between every rematch
- touch targets too small on phones

### Why ToyTools can win
- Ships on the proven board-game engine - consistent UX, fast to build.
- Runs fully client-side - private, offline-capable, no upload (a core ToyTools advantage).
- The need is exactly algorithmic: a deterministic tool beats an AI answer on speed, precision, and trust.

### Craft hypothesis (where its users actually fail)
- A disc is dropped in the wrong column because the hover highlight lagged behind the finger.
- A diagonal win is missed by the detector when the board is full of near-misses.
- Undo reverts two plies instead of one after a mis-tap, and the turn indicator disagrees with the board.
- Landscape mode clips the top row on a short phone and the winning cell is off-screen.

Pick ONE of these and match it to a craft kind (recovery, verification, continuation, guardrail, orientation). See .claude/skills/tool-craft/SKILL.md.

### Engine
- Reuses existing engine: `board-game`
- Future tools this unlocks: tic-tac-toe, chess-tac-toe, quantum-tic-tac-toe

### Estimates
- Implementation effort: **medium**
- Long-term SEO value: **high**
- Maintenance cost: **low**

### Suggested supporting content
- Guides: What is Hot-Seat Board Game?; How to hot-seat board game online; Connect 4 vs the alternatives
- FAQs: How do I hot-seat board game?; Is Connect 4 free and private?; Does Connect 4 avoid "matchmaking when both players are on one couch"?
- Internal links / related tools: tic-tac-toe
- Schema: SoftwareApplication, FAQPage

---

_Inputs fingerprint: `eb953587`. Run `npm run research:status` to check this report against the current datasets and catalog before acting on it._
