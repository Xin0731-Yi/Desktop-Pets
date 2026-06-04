# Focus Pet

Focus Pet is a cozy desktop companion that turns focused time into pet growth. It combines a Pomodoro timer, a floating pixel pet, local progress, and small interactions so studying feels like caring for a tiny learning partner.

## MVP Features

- Electron desktop app with a transparent, frameless, always-on-top window.
- React + TypeScript renderer powered by Vite.
- Pomodoro loop: 25 minute focus, 5 minute short break, 15 minute long break, long break every 4 focus rounds.
- Timer controls: start, pause/continue, reset, and skip.
- Timer bubble above the pet with focus/rest icons, urgency colors, and final 10 second bounce.
- Pixel-style cat pet with idle, study, rest, happy, feeding, and level-up feedback states.
- Growth data: level, EXP, stage, coins, total Pomodoros, and total focus time.
- Pet stats: hunger, mood, and energy.
- Interactions: feed the pet with coins and pet it to improve mood.
- Local persistence through `localStorage`.

## Getting Started

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
```

Run the desktop app:

```bash
npm run dev
```

Run a production build check:

```bash
npm run build
```

## Troubleshooting

If an interrupted install leaves Electron without its local binary, run:

```bash
npm rebuild electron
```

If that still fails, remove `node_modules` and run `npm install` again with a stable network connection.

## Project Structure

```text
electron/
  main.ts        Electron window setup
  preload.ts     Safe renderer bridge
src/
  components/    Pet, timer bubble, controls, and stats UI
  lib/           Timer and progression helpers
  store/         Reducer-driven local app state
  styles/        Pixel-inspired global styles
```

## Roadmap

- Replace CSS pixel placeholder with hand-authored sprite sheets.
- Add room view, furniture, and furniture-based growth bonuses.
- Add unlockable hats, scarves, glasses, backpacks, and wings.
- Add achievements for streaks, total Pomodoros, and total focus hours.
- Add import/export of save data.
- Add packaged Windows and macOS builds.

## Open Source Notes

The MVP intentionally avoids paid systems and cloud storage. All progress is stored locally on the user's computer, and every future cosmetic or room item should be unlockable through focus and growth.

## License

MIT
