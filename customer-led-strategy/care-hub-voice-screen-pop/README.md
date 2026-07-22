# Care Hub · Voice Screen-Pop

Customer-led prototype for inbound voice: when a call routes, Care Hub populates the agent workspace with identity, IVR intent, care context, and a suggested next action—before the agent picks up.

## Path

`customer-led-strategy/care-hub-voice-screen-pop`

## Open the prototype

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8765 --directory .
```

Then visit `http://localhost:8765`.

## Demo flow

1. Click **Incoming call** to fire the screen-pop.
2. Review caller identity, IVR intent, care snapshot, and recent interactions.
3. Click **Answer** to mark the call connected, or **Dismiss** to clear the pop.
4. Use **Open scheduling** for the suggested next action.

## Project docs

- [Brief](./docs/brief.md) — problem, outcomes, principles
- [Call journey](./docs/call-journey.md) — signal → pop → action
