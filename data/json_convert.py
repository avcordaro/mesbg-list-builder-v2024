import pandas as pd
import json
import re

data_files_base_path = '../src/assets/data'

warband_sizes = {
  "Hero of Legend": 18,
  "Hero of Valour": 15,
  "Hero of Fortitude": 12,
  "Minor Hero": 6,
  "Independent Hero": 0,
  "Warrior": 0,
  "Siege Engine": 6
}
unit_type_order = [
  "Hero of Legend",
  "Hero of Valour",
  "Hero of Fortitude",
  "Minor Hero",
  "Independent Hero",
  "Warrior",
  "Siege Engine"
]

def map_warband_sizes(row):
    if row['name'] in ["The Dark Lord Sauron", "The Goblin King"]:
        return 24
    if row['name'] in ["Grinnah, Goblin Jailer", "The Goblin Scribe", "Goblin Captain"]:
        return 18
    return warband_sizes[row['unit_type']]

df_models = pd.read_excel("mesbg_data.xlsx", sheet_name="models")
df_models['warband_size'] = df_models.apply(map_warband_sizes, axis=1)
df_models.unit_type = pd.Categorical(df_models.unit_type, categories=unit_type_order)
df_models = df_models.rename(columns={"name": "model"})
df_options = pd.read_excel("mesbg_data.xlsx", sheet_name="options")
df_options = df_options.sort_values(['model_id', 'points'], ascending=[True, False])
df_options['quantity'] = df_options['included'].apply(lambda x: 1 if x == True else None)
df_options['dependencies'] = df_options['dependencies'].fillna("[]").apply(eval)
df_merged = df_models.merge(df_options, on='model_id', how='left')
df_merged['opt_mandatory'] = df_merged['opt_mandatory'].apply(lambda x: True if x == 1.0 else False)
df_merged['no_followers'] = df_merged['no_followers'].apply(lambda x: True if x == 1.0 else False)

df_merged_options = df_merged.groupby([
  'model_id', 
  'army_type', 
  'army_list', 
  'profile_origin', 
  'model', 
  'unit_type', 
  'base_points', 
  'default_bow', 
  'default_throw',
  'unique', 
  'siege_crew',
  'bow_limit',
  'opt_mandatory',
  'MWFW',
  'no_followers',
  'warband_size'
]).apply(lambda x: x[[
  'id', 
  'name', 
  'points', 
  'type',
  'included',
  'dependencies',
  'mount_name',
  'passengers',
  'quantity'
]].to_dict(orient='records')).reset_index(name='options')
df_merged_options = df_merged_options.sort_values(['army_list', 'unit_type', 'base_points', 'model'], ascending=[True, True, False, True])
df_merged_options['MWFW'] = df_merged_options['MWFW'].apply(eval)
df_merged_options['warband_size'] = df_merged_options['warband_size'].astype(int) 
df_merged_options = df_merged_options.rename(columns={"model": "name"})

json_dict = df_merged_options.to_dict(orient='records')
json_dict = [{k:v for k,v in d.items() if v is not False and not pd.isnull(v if type(v) != list else 1)} for d in json_dict]
for d in json_dict:
    if len(d['options']) == 0 or pd.isnull(d['options'][0]['id']):
        d['options'] = []
    else:
        d['options'] = [{k:v for k,v in d.items() if v != [] and v is not False and not pd.isnull(v)} for d in d['options']]
        for o in d['options']:
            o['points'] = int(o['points'])
            if 'quantity' in o:
                o['quantity'] = int(o['quantity'])
            if 'passengers' in o:
                o['passengers'] = int(o['passengers'])
            if 'included' in o:
                o['included'] = o['included'] == 1

json_dict = {d['model_id']: d for d in json_dict}

with open(data_files_base_path + '/mesbg_data.json', "w") as file:
    file.write(json.dumps(json_dict, indent=2))

df_faction = pd.read_excel("mesbg_data.xlsx", sheet_name="army_lists")
df_faction.index = df_faction.name
df_faction['additional_rules'] = df_faction['additional_rules'].apply(eval)
df_faction['special_rules'] = df_faction['special_rules'].apply(eval)
df_faction['rule_highlights'] = df_faction['rule_highlights'].apply(eval)
df_faction['break_point'] = df_faction['break_point'].fillna("")
df_faction = df_faction[['additional_rules', 'special_rules', 'bow_limit', 'throw_limit', 'break_point', 'rule_highlights']]
json_dict = df_faction.to_dict(orient='index')
json_dict = {f:{k:v for k,v in json_dict[f].items() if v != ""} for f in json_dict.keys()}

with open(data_files_base_path + '/army_list_data.json', "w") as file:
    file.write(json.dumps(json_dict, indent=2))
    
df_hero_constraints = pd.read_excel("mesbg_data.xlsx", sheet_name="hero_constraints")
df_hero_constraints['valid_warband_units'] = df_hero_constraints['valid_warband_units'].apply(eval)
df_hero_constraints['extra_profiles'] = df_hero_constraints['extra_profiles'].apply(eval)
df_hero_constraints = df_hero_constraints.groupby('model_id').apply(lambda x: x[['valid_warband_units', 'extra_profiles']].to_dict(orient='records')[0])

with open(data_files_base_path + '/hero_constraint_data.json', "w") as file:
    file.write(json.dumps(df_hero_constraints.to_dict(), indent=2))

df_warning_rules = pd.read_excel("mesbg_data.xlsx", sheet_name="warning_rules")
df_warning_rules['dependencies'] = df_warning_rules['dependencies'].apply(eval)
df_warning_rules = df_warning_rules.groupby('subject').apply(lambda x: x[['type', 'dependencies', 'warning']].to_dict(orient='records'))

with open(data_files_base_path + '/warning_rules.json', 'w') as f:
    f.write(df_warning_rules.to_json(orient='index', indent=2))

df_keywords = pd.read_excel("mesbg_data.xlsx", sheet_name="keywords")

with open(data_files_base_path + '/keywords.json', 'w') as f:
    f.write(df_keywords.to_json(orient='records', indent=2))