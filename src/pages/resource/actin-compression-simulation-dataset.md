---
templateKey: resource
name: Actin compression simulation dataset
resourceDetails:
  type: dataset
  name: Actin compression simulation dataset
  shortDescription: >
      This dataset contains simulated data of actin filaments using the monomer-scale model [ReaDDy](https://github.com/simularium/readdy-models) and fiber-scale model [Cytosim](https://github.com/simularium/Cytosim).
  description: |
    ### Overview

    This dataset contains simulated data of actin filaments using the monomer-scale model [ReaDDy](https://github.com/simularium/readdy-models) and fiber-scale model [Cytosim](https://github.com/simularium/Cytosim).

    Simulation conditions test compression of a single 500 nm actin filament at different velocities, as well as control simulations with no compression.

    Compression simulations use the prefix `ACTIN_COMPRESSION_VELOCITY`; control simulations use the prefix `ACTIN_NO_COMPRESSION`.

    Compression simulation keys include the following:

    - `0047` = 4.7 μm/s
    - `0150` = 15 μm/s
    - `0470` = 47 μm/s
    - `1500` = 150 μm/s

    For _ReaDDy_, the actin filament is composed of particles, each representing an actin monomer, initialized based on measurements from an actin crystal structure. Compression was implemented by linearly displacing the three monomers at the pointed end for one time step and then allowing the structure to relax for nine time steps, until the fiber was compressed to 350 nm. Each simulation condition contains 5 replicates.

    For _Cytosim_, the actin filament is modeled as a 500 nm fiber anchored by two fiber-binding linkers spaced 10 nm apart at each end. The linkers on one of the ends were translated linearly for one time step and allowed to relax for nine time steps, until the fiber was compressed to 350 nm. Each simulation condition contains 5 replicates, with replicates corresponding to random seeds 1, 2, 3, 4, and 5.

    ### Usage

    For documentation on how to use and interact with this dataset please refer to [https://docs.quiltdata.com/walkthrough/getting-data-from-a-package](https://docs.quiltdata.com/walkthrough/getting-data-from-a-package).

    ### License

    For questions on licensing please refer to [https://www.allencell.org/terms-of-use.html](https://www.allencell.org/terms-of-use.html).
  link: https://open.quiltdata.com/b/allencell/tree/aics/subcellular_model_simulations/subcellular_model_simulations_actin_comparison/
  status: Public
---
