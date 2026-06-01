/* ============================================================================
 * Getting It Wrong Gets You There Faster (Tableau) — WAVE DATA (the job)
 * ----------------------------------------------------------------------------
 * The engine (engine.js) is GENERIC. All game content lives here as pure data.
 * To add a wave: push another object to WAVES. No engine changes required.
 *
 * The whole narrative arc — the Predecessor's tone shifting from mocking to
 * proud — lives entirely in `scenario.intro` and `feedback.win`/`feedback.fail`.
 * Artifacts are inlined (no fetch) so the game runs from file:// and GH-Pages.
 *
 * PLANNED 5-wave arc (W1 built; W2–W5 authored next, same schema):
 *   W1 Orient the inherited workbook  — which sheet/source is the real one
 *   W2 Fix the aggregation            — summed an average / wrong grain
 *   W3 Fix the misleading chart       — 12-slice pie / truncated axis
 *   W4 De-clutter the dashboard       — 40 sheets of noise
 *   W5 The board ask                  — vague request → clarify → THE REVEAL
 *
 * SCHEMA (per wave)
 *   wave_id        number
 *   concept        { id, name, prereqs[] }
 *   ask            the stakeholder request driving the whole file (north star)
 *   callbacks      [] ids of earlier concepts this wave makes you reuse
 *   scenario       { intro (Predecessor voice) }
 *   artifact       optional — { kind:"sheet"|"viz", … } read-only reference
 *   task           { kind, directive, prompt, options?, success_check,
 *                    fail_check?, status?{win,fail,miss} }
 *                  kind: "select_option" | "select_row" | "select_column" | "select_cell"
 *   help           { tier1, tier2, tier3 }   <- pull-only, revealed one at a time
 *   feedback       { win, fail, miss? }
 *   sets_up        [] ids of concepts this wave foreshadows
 *
 * CHECK EXPRESSIONS — tiny safe comparisons (no eval): == != >= <= > <
 * ========================================================================== */

const WAVES = [
  {
    wave_id: 1,
    concept: { id: "orient_workbook", name: "Orient the inherited workbook", prereqs: [] },
    callbacks: [],
    ask: "Before you trust a single number, find which sheet is the real source you should build from.",

    scenario: {
      intro:
        "Welcome to the team! Your predecessor — me — left in a hurry. This is the workbook everything ran on: Q3_dashboard_FINAL_v4 (use this one).twbx. It's got… a few tabs. Okay, eleven tabs. Before you build anything on top of it: which sheet is the <b>actual data source</b>, not a copy or a dashboard or one of my notes-to-self?"
    },

    best_practice:
      "<b>Orient before you build.</b> In an inherited workbook, find the sheet wired to the live data <i>source</i> first — dashboards and stray duplicates are built on top of it, and any of them can be stale.",

    task: {
      kind: "select_option",
      directive: "Pick the sheet that's the <b>real data source</b> to build from.",
      prompt:
        "The tabs along the bottom: 「Dashboard FINAL v3」 · 「Sheet1 (2)」 · 「Orders (Superstore extract)」 · 「use this one!!」. Which one is the source the rest should be built on?",
      options: [
        { id: "a", label: "Dashboard FINAL v3", note: "A dashboard — it's assembled FROM other sheets, not a source itself." },
        { id: "b", label: "Sheet1 (2)", note: "A stray duplicate Tableau auto-named. No telling what's in it." },
        { id: "c", label: "Orders (Superstore extract)", note: "The sheet wired to the actual data extract — the real source." },
        { id: "d", label: "use this one!!", note: "My sticky-note tab. Trust me: past-me's confidence is not a data source." }
      ],
      success_check: "selected_option == 'c'",
      fail_check: "selected_option == 'd'",
      status: {
        win: "✅ Right call — you found the live source before trusting anything built on it.",
        fail: "Not that one — but now you know why. Try again.",
        miss: "Not quite. Find the sheet tied to the actual data extract."
      }
    },

    help: {
      tier1: "A dashboard isn't a source — it's a display built from other sheets. And a tab named after my mood isn't one either.",
      tier2: "The real source is the sheet connected to the data <i>extract</i> — the one with the actual Orders rows behind it.",
      tier3: "Look at the tab names. 'Dashboard FINAL v3' is a display. 'Sheet1 (2)' is a duplicate. 'use this one!!' is me yelling. 'Orders (Superstore extract)' is the one wired to real data — pick that."
    },

    feedback: {
      win:
        "…Huh. You went straight to the extract instead of the tab I literally labeled 'use this one'. Smart. That sticky-note tab? Stale since spring. I built three reports on it and never noticed. Maybe you'll actually fix this place. Next file.",
      fail:
        "'use this one!!' — yeah, that was me, very sure of myself. It was a copy I forgot to update. Whole Q3 number was off because of it. Good news: now you know not to trust a confident tab name. Find the sheet with real data behind it.",
      miss:
        "Close, but that's not the source. A dashboard or a duplicate isn't where the data lives. Want backup? Ask me."
    },

    sets_up: ["fix_aggregation"]
  }
];
