#!/usr/bin/env python3
"""
Compound Deprivation Data Processor
Merges county-level datasets to identify geographic overlap between:
- Food access problems
- News deserts
- Rural economic distress
- Farm loss
- Hospital/healthcare access gaps

All datasets merged by 5-digit county FIPS code.
Output: JSON file for the tool page visualization.
"""

import csv
import json
import os
from collections import defaultdict
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data" / "compound-deprivation"
OUTPUT_DIR = Path(__file__).parent.parent / "public"


def parse_rural_urban_codes():
    """Parse USDA Rural-Urban Continuum Codes (2023)."""
    counties = {}
    with open(DATA_DIR / "rural-urban-continuum-codes.csv", "r", encoding="latin-1") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fips = row["FIPS"].zfill(5)
            attr = row["Attribute"]
            val = row["Value"]
            if fips not in counties:
                counties[fips] = {"fips": fips, "state": row["State"], "name": row["County_Name"]}
            if attr == "RUCC_2023":
                counties[fips]["rucc"] = int(float(val))
            elif attr == "Population_2020":
                counties[fips]["population"] = int(float(val))
            elif attr == "Description":
                counties[fips]["rucc_desc"] = val
    return counties


def parse_food_access():
    """Parse USDA Food Environment Atlas for food access metrics."""
    food_data = defaultdict(dict)
    target_vars = {
        "PCT_LACCESS_POP19": "pct_low_food_access",
        "LACCESS_POP19": "low_food_access_pop",
        "PCT_LACCESS_LOWI19": "pct_low_income_low_access",
        "GROCPTH16": "grocery_stores_per_1000",
        "FFRPTH16": "fast_food_per_1000",
        "PCT_SNAP18": "pct_snap_participation",
        "PCT_NSLP17": "pct_school_lunch",
        "FOODINSEC_21_23": "food_insecurity_pct",  # state-level only
    }
    with open(DATA_DIR / "food-environment-atlas" / "StateAndCountyData.csv", "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fips = row["FIPS"].zfill(5)
            var_code = row["Variable_Code"]
            if var_code in target_vars:
                try:
                    food_data[fips][target_vars[var_code]] = float(row["Value"])
                except (ValueError, KeyError):
                    pass
    return food_data


def parse_news_outlets():
    """Parse sTechLab news outlets dataset. Count outlets per county."""
    county_outlets = defaultdict(int)
    county_outlet_names = defaultdict(list)
    with open(DATA_DIR / "news-outlets.csv", "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fips = row.get("CountyFIPS", "").strip()
            if fips and len(fips) >= 4:
                fips = fips.zfill(5)
                county_outlets[fips] += 1
                county_outlet_names[fips].append(row.get("Name", ""))
    return county_outlets, county_outlet_names


def parse_county_typology():
    """
    County typology download failed (USDA ERS returning 404/HTML).
    Return empty — we derive key flags from SAIPE poverty data instead.
    """
    print("  (County typology file not available, skipping)")
    return {}


def parse_saipe_poverty():
    """Parse Census SAIPE 2023 poverty estimates."""
    try:
        import xlrd
    except ImportError:
        print("xlrd not available, skipping SAIPE")
        return {}

    wb = xlrd.open_workbook(DATA_DIR / "saipe-2023.xls")
    ws = wb.sheet_by_index(0)

    # Find header row
    poverty = {}
    headers = None
    for row_idx in range(ws.nrows):
        row = [ws.cell_value(row_idx, col) for col in range(ws.ncols)]
        row_str = [str(v).strip() for v in row]

        # Look for header row
        if any("State FIPS" in s or "State FIPS Code" in s for s in row_str):
            headers = row_str
            continue

        if headers is None:
            continue

        # Build dict
        row_dict = {}
        for i, h in enumerate(headers):
            if i < len(row):
                row_dict[h] = row[i]

        # Get FIPS
        state_fips = None
        county_fips = None
        for key in headers:
            if "State FIPS" in key:
                try:
                    state_fips = str(int(float(row_dict[key]))).zfill(2)
                except (ValueError, TypeError):
                    pass
            elif "County FIPS" in key:
                try:
                    county_fips = str(int(float(row_dict[key]))).zfill(3)
                except (ValueError, TypeError):
                    pass

        if not state_fips or not county_fips or county_fips == "000":
            continue

        fips = state_fips + county_fips

        entry = {}
        for key in headers:
            key_lower = key.lower()
            val = row_dict.get(key)
            try:
                if "poverty percent" in key_lower and "all ages" in key_lower:
                    entry["poverty_rate"] = float(val)
                elif "median household income" in key_lower:
                    entry["median_income"] = float(val)
            except (ValueError, TypeError):
                pass

        if entry:
            poverty[fips] = entry

    return poverty


def compute_deprivation_scores(merged):
    """
    Compute a compound deprivation score for each county.
    Each dimension is a distinct type of infrastructure loss.
    Score = number of dimensions affected (0-4).
    """
    for fips, data in merged.items():
        dimensions = []  # Each entry = one dimension of deprivation

        # Rural classification (context, not scored)
        rucc = data.get("rucc", 0)
        is_rural = rucc >= 4

        # Dimension 1: Food access
        pct_low_food = data.get("pct_low_food_access", 0)
        if pct_low_food > 33:
            dimensions.append("food")

        # Dimension 2: News desert
        outlets = data.get("news_outlets", -1)
        if outlets == 0:
            dimensions.append("news")

        # Dimension 3: Economic distress (high poverty)
        poverty = data.get("poverty_rate", 0)
        if poverty > 20:
            dimensions.append("poverty")

        # Dimension 4: Low income (bottom quartile median household income)
        median_income = data.get("median_income", 0)
        if median_income > 0 and median_income < 42000:
            dimensions.append("income")

        data["deprivation_score"] = len(dimensions)
        data["deprivation_dimensions"] = dimensions
        data["is_rural"] = is_rural

    return merged


def main():
    print("Loading rural-urban continuum codes...")
    counties = parse_rural_urban_codes()
    print(f"  {len(counties)} counties loaded")

    print("Loading food environment atlas...")
    food_data = parse_food_access()
    print(f"  {len(food_data)} counties with food data")

    print("Loading news outlets...")
    news_counts, news_names = parse_news_outlets()
    print(f"  {len(news_counts)} counties with outlets")
    # Count news deserts
    all_county_fips = set(counties.keys())
    news_deserts = all_county_fips - set(news_counts.keys())
    print(f"  {len(news_deserts)} counties with ZERO outlets (potential news deserts)")

    print("Loading county typology...")
    typology = parse_county_typology()
    print(f"  {len(typology)} counties with typology data")

    print("Loading SAIPE poverty data...")
    poverty = parse_saipe_poverty()
    print(f"  {len(poverty)} counties with poverty data")

    # Merge all datasets
    print("\nMerging datasets...")
    merged = {}
    for fips, base in counties.items():
        entry = dict(base)

        # Food data
        if fips in food_data:
            entry.update(food_data[fips])

        # News outlets
        entry["news_outlets"] = news_counts.get(fips, 0)

        # Typology
        if fips in typology:
            entry.update(typology[fips])

        # Poverty
        if fips in poverty:
            entry.update(poverty[fips])

        merged[fips] = entry

    print(f"  {len(merged)} total counties merged")

    # Compute scores
    print("Computing deprivation scores...")
    merged = compute_deprivation_scores(merged)

    # Analysis
    rural = {f: d for f, d in merged.items() if d.get("is_rural")}
    print(f"\n=== ANALYSIS ===")
    print(f"Total counties: {len(merged)}")
    print(f"Rural counties (RUCC 4-9): {len(rural)}")

    # Score distribution
    for threshold in range(5):
        count = len([d for d in rural.values() if d.get("deprivation_score", 0) >= threshold])
        print(f"  Rural counties with {threshold}+ dimensions: {count}")

    # Compound deprivation (3+ dimensions)
    compound = sorted(
        [d for d in rural.values() if d.get("deprivation_score", 0) >= 3],
        key=lambda x: (-x.get("deprivation_score", 0), x.get("poverty_rate", 0)),
    )
    print(f"\nRural counties with 3+ deprivation dimensions: {len(compound)}")
    # 4-dimension counties
    quad = [d for d in compound if d.get("deprivation_score", 0) == 4]
    print(f"Rural counties with ALL 4 dimensions: {len(quad)}")
    for d in quad[:30]:
        dims = ", ".join(d.get("deprivation_dimensions", []))
        print(f"  {d['name']}, {d['state']} — poverty: {d.get('poverty_rate', 0):.1f}%, "
              f"food: {d.get('pct_low_food_access', 0):.1f}%, "
              f"news outlets: {d.get('news_outlets', 0)}, "
              f"income: ${d.get('median_income', 0):,.0f}")

    # Dimension frequency
    dim_counts = defaultdict(int)
    for d in rural.values():
        for dim in d.get("deprivation_dimensions", []):
            dim_counts[dim] += 1
    print(f"\nDimension frequency (rural only):")
    for dim, count in sorted(dim_counts.items(), key=lambda x: -x[1]):
        print(f"  {dim}: {count}")

    # States with most compound counties
    state_counts = defaultdict(int)
    for d in compound:
        state_counts[d["state"]] += 1
    print(f"\nStates with most compound-deprived rural counties (3+):")
    for state, count in sorted(state_counts.items(), key=lambda x: -x[1])[:15]:
        print(f"  {state}: {count}")

    # Summary stats for the page
    all_news_deserts = len([d for d in merged.values() if d.get("news_outlets", 0) == 0])
    rural_news_deserts = len([d for d in rural.values() if d.get("news_outlets", 0) == 0])
    rural_food = len([d for d in rural.values() if "food" in d.get("deprivation_dimensions", [])])
    rural_poverty = len([d for d in rural.values() if "poverty" in d.get("deprivation_dimensions", [])])
    rural_income = len([d for d in rural.values() if "income" in d.get("deprivation_dimensions", [])])

    # Total population in compound-deprived counties
    compound_pop = sum(d.get("population", 0) for d in compound)

    # Output for the tool page
    output = {
        "generated": "2026-02-21",
        "summary": {
            "total_counties": len(merged),
            "rural_counties": len(rural),
            "rural_news_deserts": rural_news_deserts,
            "rural_food_deserts": rural_food,
            "rural_high_poverty": rural_poverty,
            "rural_low_income": rural_income,
            "compound_3plus": len(compound),
            "compound_4": len(quad),
            "compound_population": compound_pop,
        },
        "counties": [],
    }

    # Include counties with any deprivation dimension
    for fips in sorted(merged.keys()):
        d = merged[fips]
        if d.get("deprivation_score", 0) == 0:
            continue
        entry = {
            "f": d["fips"],
            "n": d["name"],
            "s": d["state"],
            "p": d.get("population", 0),
            "r": d.get("rucc", 0),
            "sc": d.get("deprivation_score", 0),
            "d": d.get("deprivation_dimensions", []),
            "no": d.get("news_outlets", 0),
            "fa": round(d.get("pct_low_food_access", 0), 1),
            "pv": round(d.get("poverty_rate", 0), 1),
            "mi": round(d.get("median_income", 0)),
        }
        output["counties"].append(entry)

    # Write output
    output_path = OUTPUT_DIR / "compound-deprivation.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=None, separators=(",", ":"))

    file_size = os.path.getsize(output_path)
    print(f"\nOutput: {output_path} ({file_size:,} bytes, {len(output['counties'])} counties)")
    print(f"Summary: {json.dumps(output['summary'], indent=2)}")


if __name__ == "__main__":
    main()
