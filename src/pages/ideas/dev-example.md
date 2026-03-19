---
preliminaryFindings:
  summary: >
    Preliminary segmentation and tracking suggest that junction "flickering"
    (rapid local changes in junction length and intensity) increases ~30–60
    minutes before migration onset in a subset of fields of view. Here is a link
    for no reason: [link](https://allencell.org/).
  figures:
    - type: imageFile
      file: /img/228469011.jpg
      caption: An unrelated image from our website showing lots and lots of cells.
    - type: imageFile
      file: /img/228469011.jpg
draft: false
templateKey: idea-post
title: Investigate role of cell-cell junctions in collective cell migration (dev
  example)
type: analysis of existing data
date: 2025-10-28T19:10:00.000Z
authors:
  - Gokhan Dalgin
  - Caroline Hookway
program:
  - EMT
introduction: >
  Collective cell migration during EMT appears to be preceded by subtle
  remodeling of cell-cell junctions. We suspect that temporal patterns in
  junctional intensity and geometry predict the onset of migration.
resources:
  - cell-line-resources
  - test-software-tool
materialsAndMethods:
  dataset: Released EMT dataset
  protocols: null
  cellLines:
    - name: AICS-42
      link: https://allencell.org/cell-catalog
    - name: AICS-67
      link: https://allencell.org/cell-catalog
  software:
    - softwareTool: Simularium
      customDescription: Custom description in the markdown file for the idea, not in
        the software file markdown.
    - softwareTool: Timelapse Feature Explorer
nextSteps: |-
  - Expand analysis to all EMT datasets and stratify by treatment. And a link for no reason: [link](https://allencell.org/)
  - Quantify robustness of the junction "flicker" signature across cell lines.

  - Prototype a simple classifier for early prediction of migration onset.

  - Share intermediate results with the EMT program for feedback.
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
