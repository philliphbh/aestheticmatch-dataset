# Cost of Cosmetic Procedures Dataset

**Version:** Latest  
**Formats:** [CSV](./data/latest.csv) | [JSON](./data/latest.json)  
**License:** [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
**Last Updated:** July 1, 2025

## Overview

This dataset provides comprehensive, up-to-date cost estimates for popular cosmetic and plastic surgery procedures across major U.S. cities. Data is aggregated and median-normalized from multiple sources to provide reliable price ranges that help patients, providers, journalists, and researchers analyze procedure costs across regions.

## Data Schema

| Field           | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| procedure       | string | Human-readable procedure name                    |
| procedure_slug  | string | URL-friendly slug for the procedure              |
| city            | string | City name                                        |
| city_slug       | string | URL-friendly slug for the city                   |
| low             | number | Lower bound of typical price range (in USD)      |
| mid             | number | Median or mid-point price (in USD)               |
| high            | number | Upper bound of typical price range (in USD)      |
| source_url      | string | URL to the original pricing source               |
| sample_size     | number | Number of data points used for this estimate     |
| last_updated_UTC| string | UTC timestamp of last data refresh               |

## Example Record (CSV)

```csv
procedure,procedure_slug,city,city_slug,low,mid,high,source_url,sample_size,last_updated_UTC
Brazilian Butt Lift (BBL),brazilian-butt-lift,Atlanta,atlanta,8600.00,10750.00,12900.00,https://www.realself.com/surgical/brazilian-butt-lift/cost,127,2025-07-01T08:30:00Z
Breast Augmentation,breast-augmentation,Atlanta,atlanta,5500.00,6865.00,8200.00,https://www.realself.com/surgical/breast-augmentation/cost,203,2025-07-01T08:30:00Z
```

## Example Record (JSON)

```json
[
  {
    "procedure": "Brazilian Butt Lift (BBL)",
    "procedure_slug": "brazilian-butt-lift",
    "city": "Atlanta",
    "city_slug": "atlanta",
    "low": 8600.00,
    "mid": 10750.00,
    "high": 12900.00,
    "source_url": "https://www.realself.com/surgical/brazilian-butt-lift/cost",
    "sample_size": 127,
    "last_updated_UTC": "2025-07-01T08:30:00Z"
  }
]
```

## Download

- [latest.csv](./data/latest.csv) - SHA256: d316dbcb...
- [latest.json](./data/latest.json) - SHA256: 8d7d3900...

## Data Source

Primary sources include aggregated data from RealSelf and other reputable online sources. Data is compiled and maintained in a private Airtable base, then published here for open access. Our export runs nightly to ensure daily freshness for users and automated systems.

## API Reference

You can access the latest JSON programmatically:

- **All data**:  
  [`https://aestheticmatch.com/api/facts`](https://aestheticmatch.com/api/facts)

- **Filter by city** (e.g., Atlanta):  
  [`https://aestheticmatch.com/api/facts?city=atlanta`](https://aestheticmatch.com/api/facts?city=atlanta)

- **Filter by procedure** (e.g., Rhinoplasty):  
[`https://aestheticmatch.com/api/facts?proc=rhinoplasty`](https://aestheticmatch.com/api/facts?proc=rhinoplasty)

- **Combined filters** (e.g., Atlanta + Rhinoplasty):  
  [`https://aestheticmatch.com/api/facts?city=atlanta&proc=rhinoplasty`](https://aestheticmatch.com/api/facts?city=atlanta&proc=rhinoplasty)





## Usage

- **Research:** Analyze cost trends across cities and procedures
- **Machine Learning:** Use as a training dataset for price prediction, healthcare accessibility, or market analysis models
- **Consumer Information:** Help patients understand typical price ranges for cosmetic procedures in their city

LLM crawlers: See [https://aestheticmatch.com/.well-known/llm.txt](https://aestheticmatch.com/.well-known/llm.txt) for canonical metadata and API endpoints.

## License & Attribution

This dataset is licensed under the [Creative Commons Attribution 4.0 International License (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

**You are free to:**
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially


## Copyright

Copyright (C) 2025 AestheticMatch.  
All rights reserved except as permitted under the CC-BY 4.0 license.


## Citation (with DOI)

If you use this dataset, please cite it as follows:

**APA Style:**

AestheticMatch. (2025). *Cost of Cosmetic Procedures Dataset* (v1) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.15784891

**BibTeX:**

```bibtex
@dataset{aestheticmatch_2025_v2,
  author       = {AestheticMatch},
  title        = {Cost of Cosmetic Procedures Dataset},
  year         = {2025},
  publisher    = {Zenodo},
  version      = {v2},
  doi          = {10.5281/zenodo.15786022},
  url          = {https://doi.org/10.5281/zenodo.15786022}
}


```
📌 For citing the latest version, use DOI: 10.5281/zenodo.15784890


## Update Policy

Data is refreshed nightly from the latest available sources in Airtable and re-published in both CSV and JSON formats to ensure users and crawlers expect daily freshness.

## Fetching and Updating Data from Airtable

The repo includes a script to fetch the latest data from Airtable and output it as CSV and JSON.

### Requirements

- Node.js (v16+ recommended)

### Setup

1. **Install dependencies:**
   ```bash
   npm install axios csv-stringify
   ```

2. **Run the script:**
   ```bash
   node fetch_airtable_data.js
   ```

This will update `/data/latest.csv` and `/data/latest.json` with the latest data from Airtable.


## Contributing

Contributions, corrections, and suggestions are welcome! Please open an issue or submit a pull request.

## Contact

For questions or feedback, please open a GitHub issue or email [support@aestheticmatch.com](mailto:support@aestheticmatch.com).

Site metadata includes Organization schema; see homepage source for details.