/* ============================================================================
 * Getting It Wrong Gets You There Faster (Tableau) — ACADEMY DATA (boot camp)
 * ----------------------------------------------------------------------------
 * Before you're handed the Predecessor's cursed workbook, you train. Your
 * mentor, SAM, walks you through Tableau calm and clean. Each lesson follows
 * "gradual release of responsibility":
 *
 *     TEACH  (I do)  — Sam shows a worked example, annotated
 *     GUIDED (we do) — you try it, hint shown, the answer softly highlighted
 *     SOLO   (you do)— you do it cold, no scaffold
 *
 * Help here is PUSHED (offered freely) — the opposite of the pull-only
 * "figure it out" help on the job. Novices need the worked example first.
 *
 * Each lesson `teaches_for` a job wave: the Academy teaches the skill; the Job
 * tests it under mess. Mentor name is data — rename SAM anywhere by editing it.
 *
 * DOMAIN NOTE — why multiple-choice, not drag-and-drop: Tableau's real "doing"
 * is dragging pills onto shelves. Faithfully cloning that is costly and not
 * what teaches the *concepts*. For Tableau the skill that matters early is
 * judgment + workspace literacy (what goes where, dimension vs measure, which
 * chart) — so lessons SHOW a styled Tableau mockup (artifact kind:"viz") and
 * ask the player to make the call (kind:"select_option"). Recognition over
 * recall is more defensible here than it was for spreadsheets.
 *
 * SCHEMA (per lesson)
 *   id, week, day, concept:{name}, teaches_for
 *   ask        the standing GOAL for the whole module (north star) — constant
 *              across every step, always visible above the per-step directive
 *   reinforces []  ready-to-show names of earlier skills this module builds on
 *   best_practice  one durable habit (the 💡 Pro tip)
 *   mentor_intro
 *   teach   { explain, example:{ kind:"viz"|"sheet", …, highlight }, callout }
 *           example may also carry options:[{id,label,note?}] + answer to walk
 *           through the reasoning with the right choice pre-highlighted+locked.
 *   practice[]  { mode:"guided"|"solo", kind, task, prompt, hint?, artifact?,
 *                 options, success_check, praise }
 *               task = the one crisp directive (brief headline); prompt = context
 *               kind: "select_option" (also supports row/cell/column from core)
 *               artifact (optional) renders as read-only reference ABOVE the
 *               choices; for viz, artifact.highlight glows in guided mode.
 *   mentor_outro
 * ========================================================================== */

const MENTOR = {
  name: "Sam",
  role: "your onboarding mentor · senior analyst",
  avatar: "☕"
};

/* ---- Full syllabus (overview screen reads this) ---------------------------
 * `built: true` lessons are playable now. The rest are authored next, to this
 * same schema — the curriculum is real and visible so nothing feels stubbed.
 * M1–M5 = literacy / fundamentals.  M6–M10 = judgment / communication. */
const ACADEMY_PLAN = [
  { week: 1, day: 1,  name: "The canvas",               teaches_for: "orient_workbook",  built: true  },
  { week: 1, day: 2,  name: "Dimensions vs Measures",   teaches_for: "fix_aggregation",  built: true  },
  { week: 1, day: 3,  name: "Your first chart",         teaches_for: "—",                built: false },
  { week: 1, day: 4,  name: "Aggregation",              teaches_for: "fix_aggregation",  built: false },
  { week: 1, day: 5,  name: "The Marks card",           teaches_for: "—",                built: false },
  { week: 2, day: 6,  name: "Choosing the right chart", teaches_for: "misleading_chart", built: false },
  { week: 2, day: 7,  name: "Filters",                  teaches_for: "—",                built: false },
  { week: 2, day: 8,  name: "Tidy the viz",             teaches_for: "declutter",        built: false },
  { week: 2, day: 9,  name: "The ask",                  teaches_for: "the_board_ask",    built: false },
  { week: 2, day: 10, name: "Dashboard & say it",       teaches_for: "the_board_ask",    built: false }
];

const LESSONS = [
  /* ======================================================================== *
   * M1 — The canvas  (the Tableau keystone, like "the grid" was for sheets)
   * ======================================================================== */
  {
    id: "the_canvas",
    week: 1,
    day: 1,
    concept: { name: "The canvas" },
    teaches_for: "orient_workbook",
    ask: "Learn the Tableau workspace — know which part of the screen builds which part of a chart.",

    best_practice:
      "Before you build anything, learn the <b>map of the screen</b>. In Tableau you don't type a chart — you drag fields onto <i>shelves</i>, and which shelf you pick is the whole game.",

    mentor_intro:
      "Hey — Sam. Welcome to the team. First thing in Tableau isn't a chart, it's the <b>workspace</b>. Four regions do all the work: your <b>Data pane</b> on the left, and three shelves — <b>Columns</b>, <b>Rows</b>, and the <b>Marks</b> card. Learn what each one does and everything else clicks. Five minutes. Let's go.",

    teach: {
      explain:
        "Here's a finished view. On the <b>left</b> is the <b>Data pane</b> — every field from your data lives here. Across the top is the <b>Columns</b> shelf (it controls the <i>horizontal</i> axis) and below it the <b>Rows</b> shelf (the <i>vertical</i> axis). I dragged <b>Region</b> to Columns and <b>SUM(Sales)</b> to Rows — that's what makes one bar per region, height = sales. The <b>Marks</b> card (bottom-left of the sheet) controls how the marks <i>look</i> — color, size, label. That's the entire canvas.",
      example: {
        kind: "viz",
        title: "Sales by Region — Superstore",
        dimensions: ["Region", "Category", "Segment", "Order Date"],
        measures: ["Sales", "Profit", "Quantity"],
        columns: [{ name: "Region", role: "dim" }],
        rows: [{ name: "SUM(Sales)", role: "measure" }],
        filters: [],
        marks: { type: "Bar", fields: [] },
        chart: { type: "bar", cats: ["Central", "East", "South", "West"], vals: [103, 92, 47, 96], axis: "SUM(Sales)" }
      },
      callout: "Columns = horizontal axis. Rows = vertical axis. Marks = how it looks. Data pane = your fields."
    },

    practice: [
      {
        mode: "guided",
        kind: "select_option",
        task: "Which shelf makes the bars get <b>taller or shorter</b> based on a number?",
        prompt: "You want bar height to reflect SUM(Sales). The answer is highlighted below so you can see where it lives.",
        hint: "Bar height is the <i>vertical</i> axis. Which shelf controls vertical?",
        artifact: {
          kind: "viz",
          title: "Sales by Region — Superstore",
          columns: [{ name: "Region", role: "dim" }],
          rows: [{ name: "SUM(Sales)", role: "measure" }],
          marks: { type: "Bar", fields: [] },
          chart: { type: "bar", cats: ["Central", "East", "South", "West"], vals: [103, 92, 47, 96], axis: "SUM(Sales)" },
          highlight: "rows"
        },
        options: [
          { id: "a", label: "Columns shelf", note: "Controls the horizontal axis (left–right)." },
          { id: "b", label: "Rows shelf", note: "Controls the vertical axis (up–down) — bar height." },
          { id: "c", label: "Filters shelf", note: "Limits what's shown; doesn't size the bars." },
          { id: "d", label: "Marks card", note: "Controls look — color, size, label — not the axis." }
        ],
        success_check: "selected_option == 'b'",
        praise: "Rows shelf — the vertical axis. Put a measure there and its value becomes bar height."
      },
      {
        mode: "solo",
        kind: "select_option",
        task: "You want to <b>color each bar by Region</b>. Which part of the canvas does that?",
        prompt: "No highlight this time. Think about what changes the <i>look</i> of a mark versus what changes an axis.",
        hint: "Color isn't an axis — it's how a mark looks. Which region controls how marks look?",
        artifact: {
          kind: "viz",
          title: "Sales by Region — Superstore",
          columns: [{ name: "Region", role: "dim" }],
          rows: [{ name: "SUM(Sales)", role: "measure" }],
          marks: { type: "Bar", fields: [] },
          chart: { type: "bar", cats: ["Central", "East", "South", "West"], vals: [103, 92, 47, 96], axis: "SUM(Sales)" }
        },
        options: [
          { id: "a", label: "Drop Region on the Rows shelf", note: "That changes the vertical axis, not the color." },
          { id: "b", label: "Drop Region on Color in the Marks card", note: "The Marks card controls look — color, size, label." },
          { id: "c", label: "Drop Region on the Filters shelf", note: "That hides regions; it doesn't color them." },
          { id: "d", label: "Retype the chart title", note: "A title is just text — it changes nothing about the marks." }
        ],
        success_check: "selected_option == 'b'",
        praise: "Exactly — Color lives on the Marks card. Axes go on shelves; looks go on Marks. You can read the canvas now."
      }
    ],

    mentor_outro:
      "That's the whole workspace. Data pane holds your fields; Columns and Rows are your two axes; Marks is how it looks. Next: the one distinction Tableau cares about more than any other — <b>dimensions vs measures</b>."
  },

  /* ======================================================================== *
   * M2 — Dimensions vs Measures  (blue/discrete vs green/continuous)
   * ======================================================================== */
  {
    id: "dims_vs_measures",
    week: 1,
    day: 2,
    concept: { name: "Dimensions vs Measures" },
    teaches_for: "fix_aggregation", // → Job: fix the aggregation
    ask: "Tell dimensions from measures on sight — the blue/green split that decides every chart.",
    reinforces: ["The canvas"],

    best_practice:
      "<b>Blue = dimension</b> (a category that slices your data). <b>Green = measure</b> (a number you add up). Tableau colors every field for you — trust the color, and sanity-check anything it got wrong.",

    mentor_intro:
      "Morning. Tableau splits every field into two buckets, and the color tells you which: <b>blue dimensions</b> are categories — Region, Category, Customer — they <i>slice</i> the data. <b>Green measures</b> are numbers you aggregate — Sales, Profit, Quantity — they get summed, averaged, counted. Get this and you'll predict what any chart will do before you build it.",

    teach: {
      explain:
        "Look at the Data pane. Everything <b>above</b> the line is <b>blue</b> — those are <b>Dimensions</b>: Region, Category, Segment, Order Date. They answer <i>\"by what?\"</i> — they break a number into groups. Everything <b>below</b> the line is <b>green</b> — <b>Measures</b>: Sales, Profit, Quantity. They answer <i>\"how much?\"</i> — Tableau aggregates them (SUM by default). Rule of thumb: if you'd add it up, it's a measure; if you'd group by it, it's a dimension.",
      example: {
        kind: "viz",
        title: "Superstore — Data pane",
        dimensions: ["Region", "Category", "Segment", "Order Date", "Customer Name"],
        measures: ["Sales", "Profit", "Quantity", "Discount"],
        highlight: "measures"
      },
      callout: "Blue = dimension (group by it). Green = measure (add it up). The color is Tableau telling you the type."
    },

    practice: [
      {
        mode: "guided",
        kind: "select_option",
        task: "Which of these fields is a <b>measure</b> (a number you'd add up)?",
        prompt: "Use the colors in the Data pane below — the answer is highlighted so you can connect color to type.",
        hint: "A measure is green and gets aggregated. Which of these is a quantity you'd sum, not a category you'd group by?",
        artifact: {
          kind: "viz",
          title: "Superstore — Data pane",
          dimensions: ["Region", "Order Date", "Ship Mode"],
          measures: ["Profit"],
          highlight: "measures"
        },
        options: [
          { id: "a", label: "Region", note: "A category — you group by it. Blue dimension." },
          { id: "b", label: "Order Date", note: "A date used as a label/grouping here. Blue dimension." },
          { id: "c", label: "Profit", note: "A number you add up. Green measure." },
          { id: "d", label: "Ship Mode", note: "A category (Standard, Same Day…). Blue dimension." }
        ],
        success_check: "selected_option == 'c'",
        praise: "Profit — green, a number you aggregate. That's a measure. The other three slice the data; they're dimensions."
      },
      {
        mode: "solo",
        kind: "select_option",
        task: "Tableau is showing <b>SUM(Order ID)</b> on the Rows shelf. What's the problem?",
        prompt: "Order ID is a number, so Tableau treated it as a green measure and summed it. No highlight — make the call.",
        hint: "Ask what the number <i>means</i>. Is adding up ID numbers a real total, or nonsense?",
        artifact: {
          kind: "viz",
          title: "Orders — by something?",
          dimensions: ["Region", "Customer Name"],
          measures: ["Sales", "Profit"],
          columns: [{ name: "Region", role: "dim" }],
          rows: [{ name: "SUM(Order ID)", role: "measure" }],
          marks: { type: "Bar", fields: [] },
          chart: { type: "bar", cats: ["Central", "East", "South", "West"], vals: [70, 64, 58, 66], axis: "SUM(Order ID)" }
        },
        options: [
          { id: "a", label: "Nothing — bigger SUM(Order ID) means more sales", note: "No. Order ID is an identifier; its sum is meaningless." },
          { id: "b", label: "Order ID is really a dimension (an ID label); summing it is meaningless — convert it to a dimension", note: "Right. It's a number by accident, not a quantity to total." },
          { id: "c", label: "Switch the chart to a pie", note: "Chart type doesn't fix a nonsense measure." },
          { id: "d", label: "Add Order ID to Filters too", note: "Filtering nonsense still leaves it nonsense." }
        ],
        success_check: "selected_option == 'b'",
        praise: "Yes. An ID is a label that happens to be numeric — a dimension. Summing it produces a number that means nothing. Trust the color, but sanity-check the meaning."
      }
    ],

    mentor_outro:
      "That's the distinction the whole tool is built on. Blue groups, green aggregates — and when Tableau guesses wrong (like an ID), you catch it. You've got the two foundations now: the canvas, and field types. Time to see what the analyst before you left behind."
  }
];
