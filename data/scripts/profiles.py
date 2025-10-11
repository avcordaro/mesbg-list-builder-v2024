import json
import pandas as pd
from collections import OrderedDict

# Path to the Excel file
excel_path = "./data/profile_data.xlsx"
output_path = "./src/assets/data/profile_data_new.json"


# Clean JSON-wrapped strings in description
def clean_json_wrapped_string(value):
    if isinstance(value, str) and value.startswith('"') and value.endswith('"'):
        return json.loads(value)
    return value


# Convert each linked sheet into grouped dicts
def group_by_id(df):
    return {
        k: v.drop(columns=["id"]).to_dict(orient="records")
        for k, v in df.groupby("id", sort=False)
    }

def parse_json_field(value):
    if pd.isna(value):
        return []
    if isinstance(value, list):
        return value
    return json.loads(value)


# Load sheets
sheets = pd.read_excel(excel_path, sheet_name=None)

profiles_df = sheets["profiles"]
special_rules_df = sheets["special_rules"]
magical_powers_df = sheets["magical_powers"]
options_df = sheets["options"]
stats_df = sheets["stats"]

# Parse JSON-like columns in profiles
json_columns = ["keywords", "heroic_actions", "special_rules", "wargear", "additional_stats", "additional_text"]
for col in json_columns:
    profiles_df[col] = profiles_df[col].apply(parse_json_field)

# Clean JSON-wrapped strings in description
special_rules_df["description"] = special_rules_df["description"].apply(clean_json_wrapped_string)

special_rules = group_by_id(special_rules_df)
magical_powers = group_by_id(magical_powers_df)
options = group_by_id(options_df)
# Convert stats to a dictionary of dictionaries, removing NaNs and coercing everything to string
stats = (
    stats_df.set_index("id")
    .map(lambda v: str(v).strip() if pd.notna(v) else None)
    .apply(lambda row: {k: v for k, v in row.items() if v not in [None, "", "nan"]}, axis=1)
    .to_dict()
)

# Merge everything
profiles = {}
for _, row in profiles_df.iterrows():
    pid = row["id"]
    profile = row.to_dict()

    profile["additional_rules"] = special_rules.get(pid, [])
    profile["magical_powers"] = magical_powers.get(pid, [])
    profile["options"] = options.get(pid, [])
    profile["stats"] = stats.get(pid, {})

    # Remove optional arrays if empty
    optional_arrays = ["additional_stats", "additional_text", "additional_rules", "magical_powers"]
    for field in optional_arrays:
        if field in profile and (not profile[field] or len(profile[field]) == 0):
            profile.pop(field)

    profiles[pid] = profile

# Case-insensitive lexicographic sort of outer keys:
sorted_profiles = dict(sorted(profiles.items(), key=lambda kv: kv[0].lower()))

# Output to JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(sorted_profiles, f, indent=2, ensure_ascii=False)
