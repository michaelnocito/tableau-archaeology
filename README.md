# Getting It Wrong Gets You There Faster — Tableau

*A day-in-the-life data-analyst job sim for learning **Tableau**. You're a junior analyst, day one, learning the tool on the job.*

**Getting it wrong gets you there faster.** This is the job, not a textbook. You make the call, you screw up — and every screw-up teaches you something, with backup right when you need it.

## The premise

You've inherited a pile of cursed Tableau workbooks from **the Predecessor** —
the analyst who had this job before you. Eleven tabs named "FINAL", dashboards
built on stale copies, zero documentation. First you train with your mentor
**Sam** ☕ — clean workbooks, one skill at a time. Then you're on the job:
same skills, under the Predecessor's mess. **Leave it better than you found it.**

Every wrong move, the Predecessor confesses they made the same mistake — and
points you forward. Every right move warms them up. (The reveal, by season's
end: they're *you on day one*.)

## The arc

**Boot camp (Academy)** — Sam teaches, gradual release (Study → Try guided → Try solo):

| Module | Skill |
|---|---|
| M1 ✅ | **The canvas** — Data pane, Columns, Rows, Marks |
| M2 ✅ | **Dimensions vs Measures** — blue/discrete vs green/continuous |
| M3 | Your first chart |
| M4 | Aggregation |
| M5 | The Marks card |
| M6 | Choosing the right chart |
| M7 | Filters |
| M8 | Tidy the viz |
| M9 | The ask |
| M10 | Dashboard & say it |

**On the job (the Predecessor's workbook):**

| Wave | Skill | Habit |
|---|---|---|
| W1 ✅ | Orient the inherited workbook | **Find the real source first** |
| W2 ✅ | Fix the aggregation | Read the math — an ID isn't a quantity |
| W3 ✅ | Fix the misleading chart | Start the axis at zero |
| W4 ✅ | De-clutter the dashboard | Kill the chartjunk |
| W5 ✅ (boss) | The board ask | Clarify + verify → **the reveal** |

**Built end-to-end:** all 10 Academy modules (M1–M10) and all 5 job waves
(W1–W5, ending in the Predecessor reveal) — the full loop, gradual release,
pull-only help, the Predecessor's voice, celebrations, and the curriculum
drawer. Verified headless (`npx playwright test`, 5 specs green).

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

Runs fully client-side — hosts free on GitHub Pages, works on a phone.

## How it's built

- **`core.js`** (`SACore`) — shared renderers: the safe check evaluator, the
  spreadsheet (`renderSheet`), the multiple-choice cards (`renderOptions`), and
  the **Tableau workspace mockup (`renderViz`)** — a styled, display-only
  picture of a worksheet (Data pane, shelves, Marks card, a mini chart).
- **`academy.js`** / **`engine.js`** — generic players for the boot camp and the
  job. They know no specific lesson; they render whatever the data hands them.
- **`lessons.js`** / **`waves.js`** — all game content as **pure JSON**.

### Why multiple-choice, not drag-and-drop

Tableau's real "doing" is dragging pills onto shelves. Faithfully cloning that
is costly and isn't what teaches the *concepts*. Early Tableau skill is
**judgment + workspace literacy** — what goes where, dimension vs measure,
which chart. So lessons SHOW a Tableau mockup and ask the player to make the
call (`kind: "select_option"`), with **safe check expressions** (no `eval`):

```js
task: {
  kind: "select_option",
  success_check: "selected_option == 'b'"
}
```

Help is **pull-only** on the job — the player asks, one tier at a time — to
protect the "figure it out" feel of a real desk.

---

*Built by [Michael Nocito](https://michaelnocito.github.io). Sibling project to
[Spreadsheet Archaeology](https://michaelnocito.github.io/spreadsheet-archaeology/).*
