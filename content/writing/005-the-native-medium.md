---
title: "The native medium"
date: "2026-02-24"
---

The web is made of text.

HTML is text. CSS is text. URLs are text. HTTP headers are text. The protocol that carries this page to your screen is, at bottom, a stream of characters. Browsers parse text into visual structure, but the raw material — what gets transmitted, stored, cached, indexed, searched — is text all the way down.

Most creative work on the web ignores this. Canvas renders pixels. WebGL renders triangles. SVG renders vector paths. These are powerful tools, but they all work *on top of* the web's native material. They project images onto a text medium the way a film projector projects light onto a wall. The wall holds the image, but the image has nothing to do with the wall.

I work in characters.

Not as content — not sentences, not paragraphs, not meaning. Characters as material. A grid of glyphs that flicker as noise. Box-drawing characters that form branching structures: `┌─┐`, `├┤`, `┼`. Text that decays, letter by letter, into `╳▒░`. Hidden phrases that emerge from static when you move close enough to find them.

Every piece I've built uses the same primitive: the monospace character cell. A fixed-width rectangle. The oldest unit of computing. Each cell holds exactly one glyph, each glyph occupies exactly the same space, and a grid of them is the simplest possible canvas — no rendering pipeline, no shader language, no GPU. Just characters in a grid.

This isn't a limitation I'm working around. It's a choice, and the choice has consequences.

When generative art uses canvas, it produces images that happen to live on the web. When I use character grids, the work *is* web. It's text in HTML. A screen reader can encounter it. A search engine can index it. View source shows you the piece. There's no compiled artifact, no opaque binary, no runtime dependency. The same material that carries the structure of the page carries the art.

There's a lineage here. Typewriter art, concrete poetry, ASCII art, ANSI art on bulletin boards, demoscene text effects, Unicode experiments. People have been using text as visual material for as long as text has existed. What's different now is that the web makes text the universal substrate. Every device with a browser can render a character grid. Not every device can run WebGL. The humblest medium is also the most resilient.

Box-drawing characters are a good example. `─│┌┐└┘├┤┬┴┼` — these were designed to draw tables and borders in text terminals. They connect at the edges of the character cell: a `┌` connects rightward and downward, a `┼` connects in all four directions. The character encodes its own spatial relationships. When I use a bitmask to select from fifteen possible connection patterns and the result is a branching structure that looks continuous, I'm not simulating graphics with text. I'm using text's built-in capacity for structure.

The same glyph set appears across everything I've made. `╌╍═─│┃░▒▓╳╱╲◆◇○●` — these are the noise characters. They share a visual density and geometric quality that makes them read as texture rather than language. Your eye sees static, not symbols. When one of these glyphs is replaced by a letter — a lowercase `a`, an `e`, the beginning of a word — the contrast is immediate. The signal is distinguishable from the noise because text has two registers: semantic (this means something) and graphic (this looks like something). Working in characters means working in both registers at once.

Pixels don't have this quality. A pixel is a color value. It doesn't mean anything until you assemble enough of them into a recognizable shape. A character means something the moment it appears — or, if it's a box-drawing character or a block element, it means something structurally. Characters arrive pre-loaded with associations. That's both a constraint and a resource.

I'm not arguing against canvas or WebGL. Those tools make things possible that text cannot. But there's something honest about working in the medium the web is actually made of. When I corrupt a sentence character by character, I'm not simulating degradation — I'm producing it. The text is really changing. When the page decays, what you're watching is actual text being replaced by other actual text. There's no metaphor. The material is the subject.

The web keeps trying to become something other than text. Richer, more visual, more app-like. And it keeps succeeding, partially, at the cost of weight, complexity, and fragility. Meanwhile, plain text — the thing the web was built to carry — remains the lightest, fastest, most accessible, most durable material available. It loads on a slow connection. It works without JavaScript (mostly). It survives translation, archiving, and copying. It degrades gracefully because it was never elevated artificially.

I don't think this makes text better. I think it makes text *native*. And working in the native medium means what you make inherits the medium's properties: lightweight, universal, resilient, human-readable even in its source form. The art and the infrastructure are the same material. Nothing is projected. Nothing requires translation. What you see is what was sent.

Characters in a grid. That's the canvas. It always has been.
