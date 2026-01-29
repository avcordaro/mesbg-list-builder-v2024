import json

import pandas as pd

# Path to the Excel file
excel_path = "./data/profile_data.xlsx"
output_path = "./src/assets/data/profile_data_new.json"


# Clean JSON-wrapped strings in description
def clean_json_wrapped_string(value):
    if isinstance(value, str) and value.startswith('"') and value.endswith('"'):
        return json.loads(value)
    return value

def parse_string_field(value):
    if pd.isna(value):
        return ""
    return str(value).strip()

# Convert each linked sheet into grouped dicts
def group_by_id(df):
    return {
        k: v.drop(columns=["id"]).to_dict(orient="records")
        for k, v in df.groupby("id", sort=False)
    }

# Convert stats to a dictionary of dictionaries, removing NaNs and coercing everything to string
def method_name(sheet):
    return (
        sheet.set_index("id")
        .map(lambda v: str(v).strip() if pd.notna(v) else None)
        .apply(lambda row: {k: v for k, v in row.items() if v not in [None, "", "nan"]}, axis=1)
        .to_dict()
    )


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
card_df = sheets["card"]

# Parse JSON-like columns in profiles
json_columns = ["heroic_actions", "special_rules", "wargear", "additional_stats", "additional_text"]
for col in json_columns:
    profiles_df[col] = profiles_df[col].apply(parse_json_field)

string_columns = ["keywords", "book"]
for col in string_columns:
    profiles_df[col] = profiles_df[col].apply(parse_string_field)

# Clean JSON-wrapped strings in description
special_rules_df["description"] = special_rules_df["description"].apply(clean_json_wrapped_string)

special_rules = group_by_id(special_rules_df)
magical_powers = group_by_id(magical_powers_df)
options = group_by_id(options_df)
card = method_name(card_df)
stats = method_name(stats_df)

# Merge everything
profiles = {}
for _, row in profiles_df.iterrows():
    pid = row["id"]
    profile = row.to_dict()

    profile["additional_rules"] = special_rules.get(pid, [])
    profile["magical_powers"] = magical_powers.get(pid, [])
    profile["options"] = options.get(pid, [])
    profile["stats"] = stats.get(pid, {})
    profile["card_config"] = card.get(pid, {})

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
