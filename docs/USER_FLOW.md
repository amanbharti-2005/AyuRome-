# AyuRome user flow (current prototype)

## Level 1 — Discover Yourself
1. Welcome / homepage.
2. Choose one of the four anime avatars.
3. Enter profile details (name, age, phone, optional email), wellness goal and welcome name.
4. Save profile → Level 1 completion screen → first star lights up.

## Level 2 — Discover Your Dosha
1. Answer six temporary demo questions. Each answer contributes one point to Vata, Pitta or Kapha.
2. The highest score selects the current Dosha (ties currently resolve to the first highest category in Vata, Pitta, Kapha order).
3. Reveal screen shows the Dosha, element, traits and suggestion → second star lights up.
4. The six questions are placeholders and should be replaced when the owner supplies the final question set.

## Level 3 — Your Personalized Roll-On
1. Open the selected Dosha roll-on from the quiz result.
2. View the matching bottle photo, drag horizontally to rotate its perspective, or use Rotate left / Rotate right.
3. Review fragrance notes and the ingredient list for the selected concept.
4. Complete Level 3 → third star lights up.

## Independent Dosha / Shop paths
- Clicking Vata, Pitta or Kapha on the homepage opens that Dosha's preview page.
- From the preview, users can open its matching roll-on or start the general Dosha quiz.
- Shop opens all three roll-on cards. Each card opens its own matching roll-on screen.
- Each roll-on screen uses a separate image asset: `rollon-vata.png`, `rollon-pitta.png`, `rollon-kapha.png`.

## After the three levels
- Wellness Journey → daily routine checklist and mood tracker.
- Profile details and progress are saved in browser local storage.

## Notes / scope
- The current quiz uses six demo questions. Replace these with the final questions and scoring rules when provided.
- The bottle rotation is a CSS 3D-perspective interaction using the supplied front-view product photograph; it is not a full photogrammetry/360-degree 3D model. A true 3D model can replace it later without changing the page flow.
- Roll-on ingredient and fragrance data are prototype content, not medical advice or a validated product formulation. Confirm the final formulation and safety/label details before real-world use.
