---
title: Voxel Lighting Studio
description: A browser tool for building voxel scenes in a 16×16×16 grid and studying how light changes them — sun angle, colour temperature, shadow softness and sky, all adjustable live.
role: Experiment
year: "2026"
skills:
  - Creative coding
  - Real-time 3D
  - Lighting
thumbnail: /images/play/voxel-lighting-studio/golden-hour.jpg
liveUrl: https://anujprajapatiii.github.io/voxel_lighting/
# The tool now renders on first paint inside an iframe (verified against the
# EmbedFrame requirement): it re-renders and re-bakes shadows when the canvas
# gains real dimensions, so a hidden/zero-size mount no longer stays blank.
embedUrl: https://anujprajapatiii.github.io/voxel_lighting/
sortOrder: 0
draft: false
---

A small tool for placing blocks in a 16×16×16 grid — but the blocks are
scaffolding. The point is the lighting rig sitting behind them.

## Same scene, different light

Nothing changes between these two except the lighting. Golden Hour runs the sun
warm at 2650K with tight, dark shadows:

![The voxel scene lit at golden hour, warm and low](/images/play/voxel-lighting-studio/golden-hour.jpg)

Dusk drops the intensity, pushes the temperature to 8500K and softens the
shadows until the whole model turns blue and quiet:

![The same voxel scene at dusk, cool and blue](/images/play/voxel-lighting-studio/dusk.jpg)

That gap — same geometry, completely different mood — is the entire reason the
tool exists.

## The controls

The sun is driven by time of day, azimuth and midday height, with its own colour
temperature and intensity. Shadows have softness and darkness of their own. The
sky contributes separately again — sky light, flat ambient, haze and blueness —
alongside ambient occlusion, camera and stage panels.

Four presets sit under the whole thing: **Honey**, **Golden Hour**, **Ember** and
**Dusk**, plus a **Shuffle** for when you want to be surprised.

## Under the hood

Built with three.js. Every voxel in the grid renders as a single instanced
mesh, so the whole scene costs one draw call no matter how full it gets. The
cubes have rounded edges, which sounds cosmetic but does most of the work: the
highlight running along each corner is what makes a stack of boxes read as
solid objects rather than flat shapes.

Colour is handled with ACES filmic tone mapping against a physically-based sky,
so moving the sun changes the atmosphere rather than just the brightness.

There's no backend. The scene *and* every lighting value are encoded into the
URL, so **Copy link** hands you a permalink that reopens exactly what you were
looking at.

## Generators

Building by hand gets old when what you actually want is something to light, so
there are six generators — **Clusters**, **Caves**, **Terrain**, **Ruins**,
**Isles** and **Crystals** — that fill the volume with something worth
photographing.

## Notes

TODO(Anuj): a couple of lines in your own voice — what you were chasing, and
what surprised you once the lights were moving.
