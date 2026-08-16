---
title: Voxel Lighting Studio
description: A browser tool for building voxel scenes in a 16×16×16 grid, then watching light change them. Sun angle, colour temperature, shadow softness and sky, all adjustable live.
role: Experiment
year: "2026"
skills:
  - Creative coding
  - Real-time 3D
  - Lighting
thumbnail: /images/play/voxel-lighting-studio/golden-hour.jpg
# Shown beside the homepage Play list while this row is pointed at. The first
# two are the case study's own screenshots, resized to the frame they render
# in (550w, ~22KB) rather than served at 1600w; the third is a stand-in until
# there is a real one.
previews:
  - /images/play/voxel-lighting-studio/previews/preview-1.jpg
  - /images/play/voxel-lighting-studio/previews/preview-2.jpg
  - /images/play/voxel-lighting-studio/previews/preview-3.svg
liveUrl: https://anujprajapatiii.github.io/voxel_lighting/
# The tool now renders on first paint inside an iframe (verified against the
# EmbedFrame requirement): it re-renders and re-bakes shadows when the canvas
# gains real dimensions, so a hidden/zero-size mount no longer stays blank.
embedUrl: https://anujprajapatiii.github.io/voxel_lighting/
sortOrder: 0
draft: false
---

The lighting rig is the point. The blocks are only there to catch the light.

Place voxels in a **16×16×16** grid, then move the sun and watch the scene
change character.

## Same scene, different light

Nothing changes between these two images except the light.

Golden Hour runs the sun warm at **2650K**, with tight, dark shadows:

![The voxel scene lit at golden hour, warm and low](/images/play/voxel-lighting-studio/golden-hour.jpg)

Dusk drops the intensity, pushes the temperature to **8500K** and softens the
shadows until the whole model turns blue and quiet:

![The same voxel scene at dusk, cool and blue](/images/play/voxel-lighting-studio/dusk.jpg)

Same geometry, completely different mood. That gap is the reason the tool
exists.

## The controls

**Sun.** Time of day, compass direction and midday height, plus its own colour
temperature and intensity.

**Shadows.** Softness and darkness, set separately from the sun.

**Sky.** Sky light, flat ambient, haze and blueness, all contributing on their
own.

**Stage.** Ambient occlusion (shadow that gathers in crevices), camera and
stage panels.

Four presets sit under the whole thing: **Honey**, **Golden Hour**, **Ember**
and **Dusk**, plus a **Shuffle** for when you want to be surprised.

## Under the hood

Built with three.js.

Every voxel renders as a single instanced mesh (one batched GPU call), so the
whole scene costs one draw call no matter how full it gets.

The cubes have rounded edges. That sounds cosmetic, but it does most of the
work: the highlight running along each corner is what makes a stack of boxes
read as solid objects rather than flat shapes.

Colour runs through ACES filmic tone mapping (film-style highlight rolloff)
against a physically-based sky, so moving the sun changes the atmosphere, not
just the brightness.

There is no backend. The scene and every lighting value encode into the URL, so
**Copy link** hands you a permalink that reopens exactly what you were looking
at.

## Generators

Building by hand gets old when what you want is simply something to light. Six
generators fill the volume for you: **Clusters**, **Caves**, **Terrain**,
**Ruins**, **Isles** and **Crystals**.
