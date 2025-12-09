# External Embeddable Onboarding Widget

This project provides a lightweight **JavaScript onboarding widget** that can be embedded into _any website_ using a simple `<script>` tag.
It is built with **TypeScript** and bundled with **Vite** into an IIFE (Immediately Invoked Function Expression) so it runs safely in any environment without interfering with host pages.

The widget supports:

- Step-by-step guided tours
- Configurable targets and content
- Resume support
- Event hooks for analytics
- Shadow DOM isolation
- Zero dependencies (vanilla JS recommended)

---

<!-- fix this installation to be tailored to our deployed EEW  -->

## Installation

You can host the generated script (`onboard.iife.js`) on any static server or CDN.

Example:

```
/dist/onboard.iife.js
```

---

## Usage (Embed on Any Website)

Include the script:

```html
<script src="https://your-cdn.com/onboard.iife.js"></script>
```

Then initialize the widget:

```html
<script>
  const steps = [
    { id: "s1", target: "#logo", content: "Welcome to the site!" },
    { id: "s2", content: "We will show you around." },
    { id: "s3", content: "You can skip anytime." },
    { id: "s4", content: "Resume is supported." },
    { id: "s5", content: "Done — thanks!" },
  ];

  const widget = window.initOnboard({
    steps,
    tourId: "demo-tour",
    resume: true,
    onEvent: (e) => console.log("event", e),
  });

  document
    .getElementById("startDemo")
    .addEventListener("click", () => widget.start());
</script>
```

---

## 🧠 How It Works

`initOnboard(config)`:

- Validates the config
- Creates an isolated widget instance
- Injects the UI into the page (optionally via Shadow DOM)
- Stores progress using `localStorage` (if `resume: true`)
- Returns a widget controller object with methods like:

```ts
widget.start();
widget.stop();
widget.next();
widget.previous();
```

---

## ⚙️ Configuration Options

### `steps: Step[]` (required)

Each step contains:

```ts
interface Step {
  id: string;
  target?: string; // CSS selector
  content: string;
}
```

### `tourId: string`

Unique ID used for resume/save behavior.

### `resume: boolean`

If `true`, the widget will continue from the last visited step.

### `onEvent(e)`

Optional analytics callback:

```ts
onEvent: (event) => {
  // event = { type: 'start' | 'next' | 'finish', stepId?: string }
};
```

---

## 🛠️ Development

### Install dependencies

```bash
npm install
```

### Start development mode

```bash
npm run dev
```

### Build the production IIFE bundle

```bash
npm run build
```

This outputs:

```
dist/onboard.iife.js
```

This is the file you embed on external websites.

---

## 🏗️ Project Structure

```
src/
│── main.ts          // IIFE entry point
│── widget.ts        // Widget factory logic
│── ui/
│     └── tooltip.ts // Tooltip UI rendering
│── types.ts         // Shared types
dist/
│── onboard.iife.js  // Final embed script
```

---

## 🔒 Isolation & Safety

The widget is designed to be safe inside any host website:

- Uses a **Shadow DOM** container (optional depending on your setup).
- CSS is sandboxed to avoid collision with host styles.
- No global variables except `window.initOnboard`.
- No external dependencies (works fully standalone).
- No access to host app frameworks (React/Vue/etc.).

---

## 🧪 Testing Your Widget Locally

Create a simple `test.html`:

```html
<!DOCTYPE html>
<html>
  <body>
    <h1 id="logo">My Test Site</h1>
    <button id="startDemo">Start Tour</button>

    <script src="./dist/onboard.iife.js"></script>

    <script>
      window.initOnboard({
        tourId: "demo",
        resume: true,
        steps: [
          { id: "1", target: "#logo", content: "Welcome!" },
          { id: "2", content: "Another step." },
        ],
      });
    </script>
  </body>
</html>
```

Run:

```bash
npm run build
npx serve dist
```

---

## 📜 License

MIT. You may use this widget in commercial or open-source projects.
