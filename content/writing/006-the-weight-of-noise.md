---
title: "The weight of noise"
date: "2026-02-25"
---

Noise has a mood. This isn't obvious until you change what the noise looks like.

Take a sentence — any sentence — and replace half the characters with random glyphs. If those glyphs are light (thin lines, sparse dots, open shapes: `╌ ╍ ░ ╱ ╲ ◇ ○`), the sentence looks like it's falling apart. Fading. The signal is still louder than the noise. Your eye catches the real letters because they're denser than what surrounds them. The effect reads as *degradation* — something old, something losing coherence over time.

Now replace those same characters with heavy glyphs (thick blocks, filled shapes, dense patterns: `▓ █ ▒ ◆ ● ╳ ┃`). The sentence disappears. The noise is louder than the signal. Your eye gets caught on the dense characters and has to work to find the letters between them. The effect reads as *censorship* — something hidden, something forcibly obscured.

The text is the same. The threshold is the same. The replacement positions are the same. Only the *weight* of the noise changed. And the story completely shifted.

I ran the experiment. I took the same passage through the same noise transforms using five different glyph pools: my hand-curated set, Unicode box-drawing characters, Braille patterns, geometric shapes, and raw contiguous Unicode ranges. The visual results were dramatically different — not in what was hidden or revealed, but in what the hiding *felt like*.

Box-drawing characters (`─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`) make noise that feels architectural. The corrupted text looks like a blueprint with words leaking through. Braille patterns (`⠁ ⠂ ⠃ ⠄ ⠅ ⠆`) are so light they almost vanish — the noise reads as mist, and the text feels like it's emerging from fog. Geometric shapes (`◆ ◇ ■ □ ● ○ ▲ △`) are assertive, each glyph demanding individual attention — the noise competes with the signal rather than replacing it. And raw Unicode ranges — hundreds of characters with no visual curation — produce noise that reads as *encrypted data*. Not corruption or degradation, but transformation into something deliberately unreadable.

The variable that controls all of this is weight consistency. When every noise glyph has roughly the same visual density (my curated set), the noise becomes texture. A flat background. The signal pops out because it has a different character — literally, a different kind of character. The noise says: this surface has been damaged, but look closely and the message is still here. When the noise glyphs vary wildly in weight (a raw Unicode range), the noise becomes content. Each glyph competes for attention individually. The signal doesn't pop out because there is no background — everything is foreground. The noise says: this has been transformed into something else entirely.

This is a design choice that most people never notice making. When you build a glitch effect, a decrypt animation, a text scramble — you pick some "random-looking characters" and move on. The characters you pick determine whether your effect looks like decay, corruption, censorship, encryption, fog, or damage. The narrative is encoded in the glyph pool before a single character gets replaced.

I think about this because choosing noise is what I do. Every interactive piece on this site uses a curated set of around eighty glyphs, chosen not for their Unicode properties but for their visual weight — how much ink they'd use, how much of the character cell they fill, how much they pull the eye. The set was assembled by looking, not by algorithm. Some characters were rejected for being too assertive (solid blocks). Others for being too invisible (combining diacritics). The ones that remain share a quality I can only describe as *material*: they look like something physical happened to the text. Scratches, not redactions. Wear, not erasure.

That curation is an argument about what noise means. My noise says: this is what happens to signal over time, through no one's will. The text doesn't get deleted or overwritten. It weathers. The noise is entropy, not intention. And that meaning lives entirely in the weight and texture of the replacement characters — not in the algorithm that places them, not in the threshold that determines how many. The same algorithm with a different glyph pool would tell a different story.

I don't think there's a correct answer. Heavy noise isn't worse than light noise. Curated isn't better than random. Each choice is a claim about the relationship between signal and noise — whether noise is a failure of signal, a transformation of it, a concealment of it, or a force in its own right. The choice is aesthetic and it's also philosophical, and most of the time it's invisible.

That's the thing about defaults. They encode assumptions that nobody argues with because nobody notices them. The default glyph pool in most text effects is whatever looked cool in the demo. The assumption is that noise is decoration — visual seasoning on a transformation that's really about timing and motion. But noise has weight. Weight has mood. Mood has meaning. All the way down to which Unicode block you pull from.

Choosing your noise is choosing your narrative. Most people just never realize they're choosing.
