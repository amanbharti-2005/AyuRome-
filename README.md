# AyuRome — interactive wellness journey

A React + Vite prototype for a personalized Ayurvedic/Dosha discovery experience.

## Run locally

Open this folder in VS Code (the folder containing `package.json`) and run:

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite (usually `http://localhost:5173/`).

## Main flow

- Homepage: select a Dosha card or start the guided journey.
- Level 1: choose an anime avatar, complete the profile and choose a wellness goal.
- Level 2: answer six temporary demo questions; the score reveals Vata, Pitta or Kapha.
- Level 3: view the matching roll-on bottle, rotate its perspective by dragging or using the rotate controls, and review fragrance notes and ingredients.
- Completion stars: one star lights after each of Levels 1, 2 and 3.
- After Level 3: open the Wellness Journey, daily routine checklist and mood tracker.
- Shop: open any of the three Dosha roll-ons independently.

Progress is saved in browser local storage. Use “Reset Demo Progress” in the profile menu to clear it.

See `docs/USER_FLOW.md` and `docs/FLOWCHART.md` for the screen sequence and diagram.
