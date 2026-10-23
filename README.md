# Kickstarter Launch Check · client slides

A 16-slide, animated HTML client deck for the Week 9 machine learning project
([ds-ml-project-template](https://github.com/crsbln/ds-ml-project-template)): what 372,293 past Kickstarter projects
tell a creator before launch, and the Launch Check that gives an honest chance of funding.

Numbers from `presentations/client/Kickstarter_Launch_Check_Client.pptx` in the project repo
(source: `reports/results.json`). The PowerPoint (with speaker notes) and the PDF are in [`downloads/`](downloads/).

Team: Kashif Kazmi (Project Manager), Furkan Yurttepe (Data Scientist), Christian Balan (Design Thinker). All three are AIPM
(AI Project Management, neuefische); the roles are each person's focus in this project.

Plain HTML, CSS and JavaScript: no build step, no dependencies. Live at https://crsbln.github.io/ds-ml-slides/.

Motion: numbers count up, bars and columns grow, dots fill and the trap timeline draws itself each time a slide opens
(`js/animate.js` + CSS). Only a few things keep moving: the cover glow, the two weak-spot halos on the length slide, the
trap's end marker and the 51% shimmer. Text and cards stay still. `prefers-reduced-motion` shows the final state.
Hover any bar for its details (`js/tooltip.js`).

Presenter cheat sheet: https://crsbln.github.io/ds-ml-slides/presenter.html (what to say on each slide, plus the details
kept off the slides). Generated in ds-ml-project-template (`presentations/build/script.json`, `npm run cheatsheet`).

## View locally

```
python -m http.server 8080
```

Open http://localhost:8080. Keys: arrows / PageUp / PageDown / Space move between slides, Home / End jump, swipe on touch.
`#4` opens slide 4.

## Deployment (GitHub Pages)

Settings > Pages > Deploy from branch > `main` / root. `.nojekyll` is included and all paths are relative.
