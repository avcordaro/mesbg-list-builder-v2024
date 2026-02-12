import pandas as pd
import json
import os
from pathlib import Path

def nest_dict(d, keys, value):
    if len(keys) == 1:
        d[keys[0]] = value
    else:
        if keys[0] not in d:
            d[keys[0]] = {}
        nest_dict(d[keys[0]], keys[1:], value)

def excel_to_json(excel_file, output_dir="../../src/i18n/locales"):
    df = pd.read_excel(excel_file)

    Path(output_dir).mkdir(parents=True, exist_ok=True)

    languages = [col for col in df.columns if col != "key"]

    for lang in languages:
        data = {}
        for _, row in df.iterrows():
            key = row["key"]
            value = row[lang]
            if pd.isna(value):
                continue  # sla lege vertalingen over
            keys = key.split(".")
            nest_dict(data, keys, value)

        output_file = Path(output_dir) / f"{lang}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✅ {output_file} aangemaakt.")

if __name__ == "__main__":
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, '../' + "i18n.xlsx")
    excel_to_json(filename)
