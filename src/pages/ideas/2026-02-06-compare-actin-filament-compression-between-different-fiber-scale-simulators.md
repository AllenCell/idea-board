---
templateKey: idea-post
title: Compare actin filament compression between different fiber-scale simulators
type: micropublication
date: 2026-02-06T11:42:00.000Z
authors:
  - Megan Riel-Mehan
program: Other
introduction: >-
  We have previously compared simulations of single actin filament compression
  at monomer- and fiber-scales using the [ReaDDy](https://readdy.github.io/) and
  [Cytosim](https://gitlab.com/f-nedelec/cytosim) simulation engines,
  respectively, under different compression velocities. To better understand how
  these difference we observed may be specific to the choice of simulators, we
  proposed running an additional comparison between two simulators at fiber
  scale.


  Interactive visualizations of the previous simulations are available at [here](https://simularium.github.io/subcell-website).
preliminaryFindings:
  summary: Fiber-scale simulations of single actin filament compression (using
    Cytosim) were not able to capture filament supertwist behavior observed with
    monomer-scale simulations (using ReaDDy).
  figures:
    - https://www.micropublication.org/static/figures/micropub-biology-001347.png
materialsAndMethods:
  dataset: Actin compression simulation dataset
  software:
    - softwareTool: Simularium
      customDescription: Simularium enables interactive, 3D visualization of the
        simulation over time. For Simularium files from the Cytosim simulations,
        see [this
        link](https://open.quiltdata.com/b/allencell/tree/aics/subcellular_model_simulations/subcellular_model_simulations_actin_comparison/fiber_scale_cytosim/ACTIN_COMPRESSION_VELOCITY/viz/)
nextSteps: >-
  - Build a [MEDYAN](https://medyan.org/) model for compression of a single
  actin filament

  - Run simulations at different compression velocities

  - Use the [subcell-pipeline](https://github.com/simularium/subcell-pipeline) to align filaments, perform dimensionality reduction, and calculate metrics
publication: https://www.micropublication.org/journals/biology/micropub-biology-001347
tags:
  - actin
  - computational modeling
---
