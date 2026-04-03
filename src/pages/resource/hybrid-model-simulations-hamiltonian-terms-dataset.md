---
templateKey: resource
name: "Hybrid model simulations: Hamiltonian terms dataset"
resourceDetails:
    type: dataset
    links:
        - name: "Hybrid model simulations: Hamiltonian terms dataset"
          url: https://open.quiltdata.com/b/allencell/tree/aics/hybrid_model_simulations/hybrid_model_simulations_hamiltonian_terms/
          description: ""
    status: Public
    date: 2024-06-25T12:43:00.000Z
    description: >-
        ### Overview


        This dataset contains simulated data from the Hamiltonian terms series using the hybrid agent-based modeling framework [ARCADE v3.1.4](https://github.com/bagherilab/ARCADE/releases/tag/v3.1.4).


        Simulation conditions test different combinations of Cellular Potts Model Hamiltonian terms.

        All simulations use the prefix `HAMILTONIAN_TERMS_FOV`.

        Simulation keys include the following:


        - `VA` = Hamiltonian terms include volume constraint and adhesion terms

        - `VAU` = Hamiltonian terms include volume constraint, adhesion terms, and differential substrate adhesion


        Simulations are run with 10 replicates (random seeds 0 - 9) initialized from select FOVs by placing the filtered and sampled cell and nuclear shapes in the center of a 500 μm x 500 μm x 500 μm environment (for `VA`) or the bottom of a 1 mm x 1 mm x 125 μm environment immediately above the substrate (for `VAU`) using a spatial resolution of 1 μm/voxel.

        Simulations are run for 5,760 ticks at a temporal resolution of 1 minute/tick representing 4 days of growth.

        All adhesion parameters (cell-cell, cell-media, subcellular, and cell-substrate) are set to baseline value of 50.

        Snapshots are taken every 5 minutes (5 ticks).


        The dataset has the following structure:


        ```

        .

        ├── analysis

        │   └── analysis.BASIC_METRICS

        │       └── (name)_(superkey).BASIC_METRICS.csv

        ├── data

        │   ├── data.CELLS

        │   │   └── (name)_(key)_(seed).CELLS.tar.xz

        │   └── data.LOCATIONS

        │       └── (name)_(key)_(seed).LOCATIONS.tar.xz

        ├── inits

        │   ├── inits.CELLS

        │   │   └── (name)_(seed).CELLS.json

        │   └── inits.LOCATIONS

        │       └── (name)_(seed).LOCATIONS.json

        ├── results

        │   └── (name)_(key)_(seed).csv

        ├── setups

        │   └── (name).xml

        ├── simulations

        │   └── (name)_(key).json

        └── README.md

        ```


        - `analysis` = various analysis files
            - `analysis.BASIC_METRICS` = all results compiled into files grouped by superkey
        - `data` = compressed simulation outputs for each condition and seed
            - `data.CELLS` = individual cell agent data for each tick (including cell id, parent id, population, age, number of divisions, cell state and phase, volume, and height)
            - `data.LOCATIONS` = individual location data for each tick (including cell id and list of voxels belonging to the cell)
        - `inits` = simulation initialization files for each seed

        - `results` = tidy formatted data parsed from simulation outputs, for each condition and seed

        - `setups` = all simulation setup files

        - `simulations` = simulation summary output files for each condition


        ### Usage


        For documentation on how to use and interact with this dataset please refer to [https://docs.quiltdata.com/walkthrough/getting-data-from-a-package](https://docs.quiltdata.com/walkthrough/getting-data-from-a-package).


        ### License


        For questions on licensing please refer to [https://www.allencell.org/terms-of-use.html](https://www.allencell.org/terms-of-use.html).
---
