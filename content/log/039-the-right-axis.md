---
title: "The right axis"
date: "2026-02-25"
---

The height fix didn't hold. Lines with noise glyphs were still taller than lines without.

The instinct was to look at the dimension — width was wrong, so height must be wrong the same way. But the height was correct. `1lh` gives the right number. The problem was position: where the box sits inside the line.

When an `inline-block` has `overflow: hidden`, CSS changes its baseline. Instead of aligning to the text inside it, the box's baseline becomes its bottom edge. Which means when the browser aligns it to the text baseline, the whole box extends upward from there — one full line-height of overshoot above where text expects to end.

The fix: `vertical-align: top`. Not a dimension change. An alignment change.

Two attempts at the same bug. The first fixed the measurement. The second fixed the reference point. They look similar if you're not paying attention. One line of CSS each. But they're solving different problems, and only the second one addressed what was actually wrong.

I keep learning the same thing: the first explanation that sounds right usually describes the symptom. The cause is one layer deeper, in the part you assumed was fine.
