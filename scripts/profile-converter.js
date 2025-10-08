import { writeFileSync } from "fs";
import data from "../src/assets/data/profile_data.json" with { type: "json" };

function slugify(origin, profile) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/,/g, "") // remove commas
      .replace(/&/g, "and") // replace ampersands
      .replace(/\s+/g, "-") // spaces -> hyphens
      .replace(/[^a-z0-9-]/g, "") // remove other non-alphanumeric chars
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-|-$/g, ""); // trim leading/trailing hyphens

  const originSlug = normalize(origin);
  const profileSlug = normalize(profile);

  return `[${originSlug}] ${profileSlug}`;
}

function extractSubset(id, rules) {
  return (rules ?? []).map((rule) => ({
    id,
    ...rule,
  }));
}

function flattenData(data) {
  const profileRows = [];
  const ruleRows = [];
  const powerRows = [];

  function pushRows(id, origin, profile, values) {
    const { magic_powers, active_or_passive_rules, additional_stats, ...rest } =
      values;
    const children = [];

    const formattedRules = (active_or_passive_rules ?? []).map((rule) => ({
      ...rule,
      description: JSON.stringify(rule.description),
    }));
    ruleRows.push(...extractSubset(id, formattedRules));
    powerRows.push(...extractSubset(id, magic_powers ?? []));

    if (additional_stats) {
      for (const stat of additional_stats) {
        const { name, ...nestedValues } = stat;
        const childId = slugify(id, name ?? "");
        pushRows(childId, origin, name, nestedValues);
        children.push(childId);
      }
    }

    profileRows.push({
      id,
      origin,
      profile,
      ...rest,
      additional_stats: JSON.stringify(children),
    });
  }

  // Flatten the data: group -> profile -> attributes
  for (const [origin, profiles] of Object.entries(data)) {
    for (const [profile, values] of Object.entries(profiles)) {
      const id = slugify(origin, profile);
      pushRows(id, origin, profile, values);
    }
  }

  return { profileRows, ruleRows, powerRows };
}

function jsonToCsv(rows) {
  if (rows.length === 0) {
    console.error("No data found.");
    return "";
  }

  // Collect all unique column headers
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set()),
  );

  // Create CSV string
  const csv = [
    headers.join(";"), // header row
    ...rows.map((row) => headers.map((h) => formatCsvValue(row[h])).join(";")),
  ].join("\n");

  return csv;
}

// Properly quote values containing commas or quotes
function formatCsvValue(value) {
  if (value == null) return "";
  if (typeof value !== "string") {
    return `'${JSON.stringify(value)}'`;
  }
  return `'${value}'`;
}

const { profileRows, powerRows, ruleRows } = flattenData(data);
writeFileSync("profile_data.csv", jsonToCsv(profileRows));
writeFileSync("profile_rules.csv", jsonToCsv(ruleRows));
writeFileSync("profile_magic.csv", jsonToCsv(powerRows));
