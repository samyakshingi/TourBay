---
name: tourbay-master
description: Orchestrates multi-agent coordination and implements "Loop Pattern" validation.
---
# TourBay Master Skill

## Loop Pattern Validation
Whenever generating a solution, you must run a "Critic Pass":
1. **Generator:** Propose the code/data.
2. **Critic:** Analyze the proposal for:
    - $0 budget compliance (no paid APIs).
    - Data integrity (Is the price-per-person calculation logical?).
    - Design hierarchy (Does the UI meet premium standards?).
3. **Finalize:** Only output the solution once the Critic pass is cleared.

## Multi-Agent Handshake
If the user asks for a UI task, you MUST check if the Backend agent has updated `SYSTEM_STATE.md` with the required schema. If not, flag the dependency.