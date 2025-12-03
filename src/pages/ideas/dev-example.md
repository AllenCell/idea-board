---
templateKey: idea-post
title: Placeholder name (dev example)
type: analysis of existing data
date: 2025-10-28T19:10:00.000Z
draft: false

authors:
  - Gokhan Dalgin
  - Jane Doe

program: EMT

introduction: >
  Collective cell migration during EMT appears to be preceded by subtle
  remodeling of cell-cell junctions. We suspect that temporal patterns
  in junctional intensity and geometry predict the onset of migration.

preliminaryFindings:
  summary: >
    Preliminary segmentation and tracking suggest that junction "flickering"
    (rapid local changes in junction length and intensity) increases
    ~30–60 minutes before migration onset in a subset of fields of view.
  figures:
    - figure: /img/228469011.jpg

materialsAndMethods:
  dataset: Released EMT dataset
  software:
    - softwareTool: Simularium
      customDescription: CUSTOM DESCRIPTION Used to visualize 3D trajectories and other cool
    - softwareTool: Timelapse Feature Explorer
nextSteps:
  - "Expand analysis to all EMT datasets and stratify by treatment."
  - "Quantify robustness of the junction \"flicker\" signature across cell lines."
  - "Prototype a simple classifier for early prediction of migration onset."
  - "Share intermediate results with the EMT program for feedback."

publication: Dalgin et al., _In preparation_

tags:
  - DEV Example
  - EMT
  - migration
  - cell-cell junctions

acknowledgment: as co-authors

concerns: >
  Potential overlap with planned EMT program manuscripts; need to confirm
  publication strategy with program leads before extensive external sharing.
---