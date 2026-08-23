---
title: Interaction Anatomy
description: See how interface parts work together.
status: published
publishedAt: 2026-08-23
featured: true
featuredOrder: 3
role: Interaction design experiment
skills:
  - Interaction design
  - Interface systems
  - Front-end development
media:
  thumbnail: /images/play/interaction-anatomy/thumbnail.webp
interactiveDemo: interaction-anatomy
palette: sage
previews: []
---

This demo breaks a familiar chat interface into six understandable parts. Pick
one in the panel and the phone prepares the right example, highlights the part,
and explains what it contributes.

## Start outside

Begin with the demo area, then move inward through the device and screen. The
last three steps show how the interface remembers what is happening, responds
to input, and makes progress visible.

Use the numbered list for direct access, or Previous and Next for the guided
route. The highlight can be hidden without stopping the demo.

## Try it

The phone is live. Type a question and send it to see the same sequence in
practice: your action changes what the interface remembers, the screen updates,
and a short waiting state bridges the reply.

## Built in

The original prototype was a standalone HTML page with its own visual system.
This version keeps the interaction model but rebuilds it as one focused React
island inside the Astro case-study route.

Its type, surfaces, spacing, focus treatment, and light/dark behaviour come
from the portfolio system. The experiment owns the live phone and walkthrough;
the site still owns the page around it.
